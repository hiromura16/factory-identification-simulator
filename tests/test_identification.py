"""模擬識別イベントの保存、再開、ラベル画像の出力を検証する。"""

import asyncio
import io
from fastapi.testclient import TestClient
from PIL import Image
from models import Profile, Spec
from store import Store
from controller import Controller
from drivers import EventDriver
from studio import create_app


def test_capture_duplicates_missed_reads_and_real_labels(tmp_path):
    """重複・未読・未登録作業者を含む識別イベントを検証する。

    保存結果に加え、Code 128・EAN-13・QRの各PNGが実際に
    画像として読み取れることをHTTPクライアントで確かめる。
    """

    async def run():
        """一時DBにイベントを保存し、生成・再開時の状態を照合する。

        個数、EPCの長さ、EAN-13のチェック数字、ドライバーの
        再開位置を確認する。
        """
        store = Store(tmp_path / "capture")
        c = Controller("identification", store)
        c.spec = Spec(batch_size=6)
        c.spec.identification.duplicate_every = 2
        c.spec.identification.drop_every = 3
        c.spec.identification.unauthorized_every = 2
        c.profile = Profile()
        d = EventDriver(c)
        await d.start()
        await d.step(0)
        with store.db() as db:
            rows = db.execute("select * from events").fetchall()
        assert len(rows) == 6 and c.produced == 4
        row = d.event(1)
        assert (
            row["operator_id"] == "UNREGISTERED-WORKER"
            and len(row["epc"]) == 24
        )
        digits = row["barcode"]
        assert (
            len(digits) == 13
            and sum(
                int(v) * (1 if i % 2 == 0 else 3) for i, v in enumerate(digits)
            )
            % 10
            == 0
        )
        await d.close()
        restarted = EventDriver(c)
        await restarted.start()
        assert restarted.index == 6
        await restarted.step(0)
        with store.db() as db:
            assert (
                db.execute("SELECT count(*) FROM events").fetchone()[0] == 12
            )
        await restarted.close()

    asyncio.run(run())
    app = create_app("identification")
    with TestClient(app) as client:
        for fmt in ["code128", "ean13", "qr"]:
            response = client.get("/source/labels/3.png?format=" + fmt)
            assert response.status_code == 200
            assert Image.open(io.BytesIO(response.content)).width > 50


def test_independent_dataset_starts_its_own_event_sequence(tmp_path):
    """別のデータセットではイベント連番をゼロから始めるか検証する。"""
    import json

    async def run():
        """同じ保存領域で二つのデータセットを順に実行する。

        各実行直後の最新二件を読み、どちらも連番が0と1である
        ことを確かめる。
        """
        c = Controller("identification", Store(tmp_path))
        c.profile = Profile()
        for name in ["first", "second"]:
            c.ds = name
            c.spec = Spec(batch_size=2)
            c.spec.generator.run_key = name
            driver = EventDriver(c)
            await driver.start()
            await driver.step(0)
            with c.store.db() as db:
                latest = db.execute(
                    "SELECT payload FROM events ORDER BY seq DESC LIMIT 2"
                ).fetchall()
            assert sorted(json.loads(r[0])["sequence_no"] for r in latest) == [
                0,
                1,
            ]
            await driver.close()

    asyncio.run(run())
