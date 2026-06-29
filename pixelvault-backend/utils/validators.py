import mimetypes
from pathlib import Path
import re

from fastapi import HTTPException, UploadFile

from config import (
    CARRIER_AUDIO_EXTENSIONS,
    CARRIER_DOCUMENT_EXTENSIONS,
    CARRIER_IMAGE_EXTENSIONS,
    CARRIER_VIDEO_EXTENSIONS,
    MAX_FILE_SIZE,
    MAX_TEXT_SIZE,
    PAYLOAD_AUDIO_EXTENSIONS,
    PAYLOAD_DOCUMENT_EXTENSIONS,
    PAYLOAD_IMAGE_EXTENSIONS,
    PAYLOAD_VIDEO_EXTENSIONS,
)

PAYLOAD_EXTENSIONS = (
    PAYLOAD_DOCUMENT_EXTENSIONS
    | PAYLOAD_IMAGE_EXTENSIONS
    | PAYLOAD_AUDIO_EXTENSIONS
    | PAYLOAD_VIDEO_EXTENSIONS
)


def validate_password(password: str) -> None:
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 uppercase letter")
    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 lowercase letter")
    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 number")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least 1 special character")



async def read_upload(file: UploadFile, max_size: int = MAX_FILE_SIZE) -> bytes:
    data = await file.read()
    if len(data) > max_size:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {max_size} bytes")
    if not data:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    return data


def validate_carrier(filename: str, carrier_type: str) -> None:
    ext = Path(filename or "").suffix.lower()
    if carrier_type == "image":
        if ext not in CARRIER_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Carrier must be PNG or JPG")
    elif carrier_type == "video":
        if ext not in CARRIER_VIDEO_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Carrier must be MP4")
    elif carrier_type == "document":
        if ext not in CARRIER_DOCUMENT_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Carrier must be PDF, DOCX, PPTX, XLSX, ODT, ODS, ODP, RTF, TXT, CSV, MD, HTML, or XML",
            )
    elif carrier_type == "audio":
        if ext not in CARRIER_AUDIO_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Carrier must be MP3, WAV, FLAC, OGG, M4A, AAC, WMA, OPUS, AIFF, or WEBA",
            )
    else:
        raise HTTPException(
            status_code=400,
            detail="carrier_type must be 'image', 'video', 'document', or 'audio'",
        )


def validate_payload_type(payload_type: str) -> None:
    allowed = {"text", "image", "video", "document", "audio"}
    if payload_type not in allowed:
        raise HTTPException(status_code=400, detail=f"payload_type must be one of {allowed}")


def validate_stego_method(method: str) -> None:
    allowed = {"auto", "lsb", "dst", "matrix", "f5", "pvd", "spatial"}
    if method not in allowed:
        raise HTTPException(status_code=400, detail=f"stego_method must be one of {allowed}")


def guess_mime(filename: str, payload_type: str) -> str:
    mime, _ = mimetypes.guess_type(filename)
    if mime:
        return mime
    defaults = {
        "text": "text/plain",
        "document": "application/octet-stream",
        "image": "image/png",
        "video": "video/mp4",
        "audio": "audio/mpeg",
    }
    return defaults.get(payload_type, "application/octet-stream")


def validate_text_payload(text: str) -> None:
    encoded = text.encode("utf-8")
    if len(encoded) > MAX_TEXT_SIZE:
        raise HTTPException(status_code=400, detail=f"Text exceeds {MAX_TEXT_SIZE} bytes")
