"""プレビュー・保存・開始で、同じ設定エラーと位置を返す。"""

from fastapi.testclient import TestClient

from studio import create_app


KIND = "identification"


PREVIEW = "/api/preview"
SAVE = "/api/presets/rejected"
START = "/api/start"


def assert_rejected(client, app, payload, expected_path, message, code):
    profile = {"output": "http", "url": "https://reader.example.invalid"}
    response = client.post("/api/profiles", json=profile)
    assert response.status_code == 200, response.text
    before = client.get("/api/state").json()
    desired = app.state.store.meta("desired")
    presets = [item["id"] for item in client.get("/api/presets").json()["presets"]]
    requests = [
        (PREVIEW, payload),
        (SAVE, payload),
        (START, payload),
        ("/api/operations/plan", {"path": START, "payload": payload}),
    ]
    for endpoint, body in requests:
        response = client.post(endpoint, json=body)
        assert response.status_code == 422, (endpoint, response.text)
        error = response.json()["detail"][0]
        assert error["loc"] == ["body", *expected_path]
        assert error["msg"] == message
        assert error["code"] == code
    assert client.get("/api/state").json() == before
    assert app.state.store.meta("desired") == desired
    assert [item["id"] for item in client.get("/api/presets").json()["presets"]] == presets


def test_generator_field_error_uses_relative_location_with_generator_prefix():
    payload = {
        "generator": {
            "fields": [
                {"name": "input_text", "generator": "constant", "value": "sample"},
                {
                    "name": "output_text", "generator": "template",
                    "template": "{input_text:03d}",
                },
            ]
        }
    }
    app = create_app(KIND)
    with TestClient(app) as client:
        assert_rejected(
            client, app, payload, ["generator", "fields", 1, "template"],
            "整数書式 d では整数型の項目を参照してください", "template_integer_format",
        )


def test_reader_checkpoint_beyond_initial_sample_is_also_validated():
    app = create_app("identification")
    payload = {
        "identification": {"tags": 4},
        "generator": {
            "rows": 3,
            "fields": [{"name": "value", "data_type": "integer", "generator": "constant", "value": 1}],
            "anomalies": [
                {"name": "bad_checkpoint", "field": "value", "operation": "set", "from_row": 8, "to_row": 8, "value": "bad"}
            ],
        },
    }
    with TestClient(app) as client:
        assert_rejected(
            client, app, payload, ["generator", "anomalies", 0, "value"],
            "値の型・範囲・書式を確認してください", "invalid_generation_value",
        )
