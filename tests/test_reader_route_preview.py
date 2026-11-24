"""同じ標準タグ位置を追う経路案内を、配送なしで確認する。"""

from fastapi.testclient import TestClient

from controller import Controller
from models import Spec
from studio import create_app


def test_route_checkpoints_match_actual_synthetic_generator(monkeypatch):
    """大きな経路でも先頭8点に絞り、異常読取機を表示する。"""

    def forbidden(*_args, **_kwargs):
        """プレビューは配信を開始しない。"""
        raise AssertionError("プレビューからの開始は許可されません")

    monkeypatch.setattr(Controller, "start", forbidden)
    readers = [f"READER-{i:02d}" for i in range(10)]
    spec = Spec.model_validate(
        {
            "generator": {"start_sequence": 7},
            "identification": {"tags": 2, "readers": readers, "wrong_reader_every": 3},
        }
    )
    with TestClient(create_app("identification")) as client:
        reply = client.post("/api/preview", json=spec.model_dump(mode="json"))
        assert reply.status_code == 200, reply.text
        body = reply.json()
        route = body["reader_route_preview"]
        assert body["writes"] is False
        assert route["reader_count"] == 10
        points = route["checkpoints"]
        assert len(points) == 8
        assert [point["sequence"] for point in points] == list(range(0, 16, 2))
        assert [point["configured_reader"] for point in points] == readers[:8]
        assert {point["event"]["tag_id"] for point in points} == {"TAG-000000"}
        assert points[0]["event"]["direction"] == "IN"
        assert points[1]["event"]["reader_id"] == "UNKNOWN-READER"
        assert points[1]["event"]["reader_id"] == body["records"][2]["reader_id"]
