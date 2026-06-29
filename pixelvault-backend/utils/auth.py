import hmac
import hashlib
import json
import time
import base64
import secrets

import cv2
import numpy as np
from fastapi import Header, HTTPException

from config import AUTH_INSTALL_ID, AUTH_SECRET, SESSION_TTL_SECONDS

QR_VERSION = "OPX1"


def build_signed_qr_payload(install_id: str | None = None) -> str:
    """Build HMAC-signed QR payload — only verifiable with AUTH_SECRET."""
    uid = install_id or AUTH_INSTALL_ID
    payload = {"v": 1, "uid": uid, "gen": int(time.time())}
    msg = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    sig = hmac.new(AUTH_SECRET.encode(), f"{QR_VERSION}.{msg}".encode(), hashlib.sha256).hexdigest()
    return f"{QR_VERSION}.{msg}.{sig}"


def decode_qr_from_image(image_bytes: bytes) -> str:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid QR image")
    detector = cv2.QRCodeDetector()
    data, _, _ = detector.detectAndDecode(img)
    return (data or "").strip()


def create_session_token(install_id: str | None = None) -> str:
    now = int(time.time())
    payload = {
        "exp": now + SESSION_TTL_SECONDS,
        "iat": now,
        "app": "opaquepixel",
        "jti": secrets.token_urlsafe(16),
    }
    if install_id:
        payload["uid"] = hashlib.sha256(install_id.encode()).hexdigest()[:16]
    msg = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    sig = hmac.new(AUTH_SECRET.encode(), msg.encode(), hashlib.sha256).hexdigest()
    return f"{msg}.{sig}"


def verify_session_token(token: str) -> bool:
    try:
        msg, sig = token.rsplit(".", 1)
        expected = hmac.new(AUTH_SECRET.encode(), msg.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return False
        padded = msg + "=" * (-len(msg) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))
        now = time.time()
        if payload.get("app") != "opaquepixel":
            return False
        if not payload.get("jti"):
            return False
        iat = payload.get("iat", 0)
        if iat > now + 60:
            return False
        return payload.get("exp", 0) > now
    except Exception:
        return False


def validate_qr_payload(decoded: str) -> bool:
    decoded = decoded.strip()
    parts = decoded.split(".")
    if len(parts) != 3 or parts[0] != QR_VERSION:
        return False
    _, msg, sig = parts
    expected = hmac.new(AUTH_SECRET.encode(), f"{QR_VERSION}.{msg}".encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return False
    try:
        padded = msg + "=" * (-len(msg) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))
        if payload.get("v") != 1:
            return False
        uid = payload.get("uid", "")
        return bool(uid) and hmac.compare_digest(uid, AUTH_INSTALL_ID)
    except Exception:
        return False


def qr_install_id_from_payload(decoded: str) -> str | None:
    """Return install id from a valid signed QR string."""
    parts = decoded.strip().split(".")
    if len(parts) != 3:
        return None
    try:
        padded = parts[1] + "=" * (-len(parts[1]) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded))
        return payload.get("uid")
    except Exception:
        return None


async def require_auth(authorization: str | None = Header(None)) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required. Upload the auth QR code first.")
    token = authorization.removeprefix("Bearer ").strip()
    if not verify_session_token(token):
        raise HTTPException(status_code=401, detail="Invalid or expired session. Re-upload the auth QR code.")
