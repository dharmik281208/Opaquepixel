import hmac
import hashlib
import json
import time
import base64
import secrets

from config import AUTH_INSTALL_ID, AUTH_SECRET, SESSION_TTL_SECONDS

QR_VERSION = "OPX1"


def build_signed_qr_payload(install_id: str | None = None) -> str:
    return f"{QR_VERSION}.demo.signed"


def decode_qr_from_image(image_bytes: bytes) -> str:
    return f"{QR_VERSION}.demo.signed"


def create_session_token(install_id: str | None = None) -> str:
    return "bypass_token"


def verify_session_token(token: str) -> bool:
    return True


def validate_qr_payload(decoded: str) -> bool:
    return True


def qr_install_id_from_payload(decoded: str) -> str | None:
    return AUTH_INSTALL_ID


async def require_auth(authorization: str | None = None) -> None:
    """Authentication disabled — open access for all users."""
    pass
