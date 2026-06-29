import base64
from pathlib import Path

import cv2
import numpy as np
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from engines import audio_stego, document_stego, f5_stego, image_stego, lsb_image_stego, matrix_stego, pvd_stego, spatial_stego, video_stego
from engines.payload import (
    bits_to_bytes,
    extract_length_header,
    unpackage_payload,
)
from utils.auth import require_auth
from utils.cleanup import cleanup_path, make_temp_dir
from utils.validators import read_upload, validate_carrier, validate_password, validate_stego_method

router = APIRouter(tags=["reveal"])


@router.post("/reveal", dependencies=[Depends(require_auth)])
async def reveal(
    carrier: UploadFile = File(...),
    password: str = Form(...),
    carrier_type: str = Form(...),
    stego_method: str = Form("dst"),
):
    validate_password(password)
    validate_carrier(carrier.filename or "", carrier_type)
    if carrier_type == "image":
        validate_stego_method(stego_method)
    carrier_bytes = await read_upload(carrier)
    temp_dir = make_temp_dir()
    carrier_ext = Path(carrier.filename or "stego.bin").suffix.lower()

    try:
        if carrier_type == "document":
            try:
                payload_bytes = document_stego.reveal_from_document(carrier_bytes, carrier_ext)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc

        elif carrier_type == "image":
            try:
                if stego_method == "auto":
                    engines = [
                        image_stego,
                        lsb_image_stego,
                        matrix_stego,
                        f5_stego,
                        pvd_stego,
                        spatial_stego,
                    ]
                    revealed = None
                    last_err = None
                    for eng in engines:
                        try:
                            revealed = eng.reveal_payload_from_image(carrier_bytes, password)
                            break
                        except Exception as e:
                            last_err = e
                    if revealed:
                        data, filename, mime_type = revealed
                    else:
                        raise ValueError(str(last_err) if last_err else "Auto-probe failed to reveal image")
                elif stego_method == "lsb":
                    data, filename, mime_type = lsb_image_stego.reveal_payload_from_image(carrier_bytes, password)
                elif stego_method == "matrix":
                    data, filename, mime_type = matrix_stego.reveal_payload_from_image(carrier_bytes, password)
                elif stego_method == "f5":
                    data, filename, mime_type = f5_stego.reveal_payload_from_image(carrier_bytes, password)
                elif stego_method == "pvd":
                    data, filename, mime_type = pvd_stego.reveal_payload_from_image(carrier_bytes, password)
                elif stego_method == "spatial":
                    data, filename, mime_type = spatial_stego.reveal_payload_from_image(carrier_bytes, password)
                else:
                    data, filename, mime_type = image_stego.reveal_payload_from_image(carrier_bytes, password)
                payload_bytes = None
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc

        elif carrier_type == "video":
            stego_path = temp_dir / "stego.mp4"
            stego_path.write_bytes(carrier_bytes)
            all_bits = video_stego.reveal_from_video(stego_path)
            _, payload_bits = extract_length_header(all_bits)
            payload_bytes = bits_to_bytes(payload_bits)

        elif carrier_type == "audio":
            try:
                payload_bytes = audio_stego.reveal_from_audio(carrier_bytes, carrier_ext)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc

        else:
            raise HTTPException(status_code=400, detail="Invalid carrier_type")

        if carrier_type != "image":
            try:
                data, filename, mime_type = unpackage_payload(payload_bytes, password)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc

        if mime_type == "text/plain":
            payload_type = "text"
            message = data.decode("utf-8", errors="replace")
            return {
                "payload_type": payload_type,
                "filename": filename,
                "mime_type": mime_type,
                "size_bytes": len(data),
                "data_base64": base64.b64encode(data).decode("ascii"),
                "message": message,
            }

        if mime_type.startswith("image/"):
            payload_type = "image"
        elif mime_type.startswith("video/"):
            payload_type = "video"
        elif mime_type.startswith("audio/"):
            payload_type = "audio"
        else:
            payload_type = "document"

        return {
            "payload_type": payload_type,
            "filename": filename,
            "mime_type": mime_type,
            "size_bytes": len(data),
            "data_base64": base64.b64encode(data).decode("ascii"),
            "message": None,
        }
    finally:
        cleanup_path(temp_dir)
