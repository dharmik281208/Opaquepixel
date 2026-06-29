import asyncio

from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from utils.auth import (
    create_session_token,
    decode_qr_from_image,
    qr_install_id_from_payload,
    validate_qr_payload,
)
from utils.rate_limit import check_rate_limit, clear_attempts, record_failed_attempt
from config import SESSION_TTL_SECONDS
from utils.validators import read_upload

router = APIRouter(tags=["auth"])


def _client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


@router.post("/auth/verify")
async def verify_auth_qr(request: Request, qr_image: UploadFile = File(...)):
    """Verify uploaded auth QR code and issue a session token."""
    client_key = _client_key(request)
    if not check_rate_limit(f"auth:{client_key}"):
        raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")

    try:
        image_bytes = await read_upload(qr_image, max_size=5 * 1024 * 1024)
        decoded = decode_qr_from_image(image_bytes)
    except ValueError as exc:
        record_failed_attempt(f"auth:{client_key}")
        await asyncio.sleep(1)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not decoded:
        record_failed_attempt(f"auth:{client_key}")
        await asyncio.sleep(1)
        raise HTTPException(status_code=400, detail="No QR code detected in the uploaded image")

    if not validate_qr_payload(decoded):
        record_failed_attempt(f"auth:{client_key}")
        await asyncio.sleep(1.5)
        raise HTTPException(status_code=403, detail="Invalid auth QR code")

    clear_attempts(f"auth:{client_key}")
    install_id = qr_install_id_from_payload(decoded)
    return {
        "access_token": create_session_token(install_id),
        "token_type": "bearer",
        "expires_in": SESSION_TTL_SECONDS,
    }
