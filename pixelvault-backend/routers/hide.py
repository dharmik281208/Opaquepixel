import io
from pathlib import Path

import cv2
import numpy as np
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from config import MAX_FILE_SIZE
from engines import audio_stego, document_stego, f5_stego, image_stego, lsb_image_stego, matrix_stego, pvd_stego, spatial_stego, video_stego
from engines.payload import (
    bytes_to_bits,
    package_payload,
    prepend_length_header,
)
from utils.auth import require_auth
from utils.cleanup import cleanup_path, make_temp_dir
from utils.validators import (
    guess_mime,
    read_upload,
    validate_carrier,
    validate_password,
    validate_payload_type,
    validate_stego_method,
    validate_text_payload,
)

router = APIRouter(tags=["hide"])


@router.post("/hide", dependencies=[Depends(require_auth)])
async def hide(
    carrier: UploadFile = File(...),
    password: str = Form(...),
    carrier_type: str = Form(...),
    payload_type: str = Form(...),
    payload: UploadFile | None = File(None),
    payload_text: str | None = Form(None),
    stego_method: str = Form("dst"),
):
    validate_password(password)
    validate_carrier(carrier.filename or "", carrier_type)
    validate_payload_type(payload_type)
    if carrier_type == "image":
        validate_stego_method(stego_method)

    carrier_bytes = await read_upload(carrier)

    if payload_type == "text":
        if not payload_text:
            raise HTTPException(status_code=400, detail="payload_text required for text payloads")
        validate_text_payload(payload_text)
        payload_data = payload_text.encode("utf-8")
        filename = "message.txt"
        mime_type = "text/plain"
    else:
        if not payload:
            raise HTTPException(status_code=400, detail="payload file required")
        payload_data = await read_upload(payload)
        filename = payload.filename or "payload.bin"
        mime_type = guess_mime(filename, payload_type)

    packaged = package_payload(payload_data, filename, mime_type, password)
    temp_dir = make_temp_dir()
    carrier_ext = Path(carrier.filename or "carrier.bin").suffix.lower()

    try:
        if carrier_type == "document":
            capacity = document_stego.get_document_capacity_bytes(len(carrier_bytes), MAX_FILE_SIZE)
            if len(packaged) > capacity:
                raise HTTPException(status_code=400, detail="Payload exceeds document carrier capacity")
            try:
                output_bytes = document_stego.hide_in_document(carrier_bytes, packaged, carrier_ext)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
            media_type = document_stego.get_carrier_mime(carrier_ext)
            out_name = f"stego{carrier_ext}"

        elif carrier_type == "image":
            try:
                if stego_method == "lsb":
                    output_bytes = lsb_image_stego.hide_payload_in_image(carrier_bytes, payload_data, filename, mime_type, password)
                elif stego_method == "matrix":
                    output_bytes = matrix_stego.hide_payload_in_image(carrier_bytes, payload_data, filename, mime_type, password)
                elif stego_method == "f5":
                    output_bytes = f5_stego.hide_payload_in_image(carrier_bytes, payload_data, filename, mime_type, password)
                elif stego_method == "pvd":
                    output_bytes = pvd_stego.hide_payload_in_image(carrier_bytes, payload_data, filename, mime_type, password)
                elif stego_method == "spatial":
                    output_bytes = spatial_stego.hide_payload_in_image(carrier_bytes, payload_data, filename, mime_type, password)
                else:
                    output_bytes = image_stego.hide_payload_in_image(carrier_bytes, payload_data, filename, mime_type, password)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc

            media_type = "image/png"
            out_name = "stego.png"

        elif carrier_type == "video":
            payload_bits = prepend_length_header(bytes_to_bits(packaged))
            carrier_path = temp_dir / "carrier.mp4"
            output_path = temp_dir / "stego.mp4"
            carrier_path.write_bytes(carrier_bytes)

            cap = cv2.VideoCapture(str(carrier_path))
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            cap.release()

            capacity = video_stego.get_video_capacity_bytes(frame_count, height, width)
            if len(payload_bits) > capacity * 8:
                raise HTTPException(status_code=400, detail="Payload exceeds video carrier capacity")

            video_stego.hide_in_video(carrier_path, payload_bits, output_path)
            output_bytes = output_path.read_bytes()
            media_type = "video/mp4"
            out_name = "stego.mp4"

        elif carrier_type == "audio":
            capacity = audio_stego.get_audio_capacity_bytes(len(carrier_bytes))
            if len(packaged) > capacity:
                raise HTTPException(status_code=400, detail="Payload exceeds audio carrier capacity")
            try:
                output_bytes = audio_stego.hide_in_audio(carrier_bytes, packaged, carrier_ext)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
            media_type = audio_stego.get_carrier_mime(carrier_ext)
            out_name = f"stego{carrier_ext}"

        else:
            raise HTTPException(status_code=400, detail="Invalid carrier_type")

        return StreamingResponse(
            io.BytesIO(output_bytes),
            media_type=media_type,
            headers={"Content-Disposition": f'attachment; filename="{out_name}"'},
        )
    finally:
        cleanup_path(temp_dir)
