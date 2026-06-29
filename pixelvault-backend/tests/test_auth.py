import io
import zipfile

from fastapi.testclient import TestClient

from main import app
from utils.auth import (
    build_signed_qr_payload,
    create_session_token,
    validate_qr_payload,
    verify_session_token,
)

client = TestClient(app)


def _minimal_docx() -> bytes:
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w") as zf:
        zf.writestr("[Content_Types].xml", '<?xml version="1.0"?><Types/>')
    return out.getvalue()


def test_session_token_roundtrip():
    token = create_session_token("test-install")
    assert verify_session_token(token)


def test_signed_qr_payload():
    signed = build_signed_qr_payload()
    assert validate_qr_payload(signed)
    assert not validate_qr_payload("OPAQUE-PIXEL-AUTH-plaintext")
    assert not validate_qr_payload("OPX1.invalid.sig")


def test_hide_requires_auth():
    res = client.post(
        "/api/hide",
        data={
            "password": "password1234",
            "carrier_type": "document",
            "payload_type": "text",
            "payload_text": "hi",
        },
        files={
            "carrier": (
                "c.docx",
                _minimal_docx(),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        },
    )
    assert res.status_code == 401
