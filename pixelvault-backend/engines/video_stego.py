import shutil
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np

from config import VIDEO_KEYFRAME_INTERVAL
from engines import image_stego as dst_image

FRAME_HEADER_SIZE = 32


def _select_frame_indices(total_frames: int, interval: int = VIDEO_KEYFRAME_INTERVAL) -> list[int]:
    return list(range(0, total_frames, interval))


def _encode_frame_map(indices: list[int]) -> bytes:
    count = len(indices)
    header = count.to_bytes(4, "big")
    body = b"".join(idx.to_bytes(4, "big") for idx in indices)
    return header + body


def _decode_frame_map(data: bytes) -> list[int]:
    count = int.from_bytes(data[:4], "big")
    indices: list[int] = []
    offset = 4
    for _ in range(count):
        indices.append(int.from_bytes(data[offset : offset + 4], "big"))
        offset += 4
    return indices


def _bits_per_frame(height: int, width: int) -> int:
    return dst_image._capacity_bits(height, width)


def get_video_capacity_bytes(frame_count: int, height: int, width: int) -> int:
    selected = len(_select_frame_indices(frame_count))
    return (selected * _bits_per_frame(height, width)) // 8


def hide_in_video(cover_path: Path, payload_bits: list[int], output_path: Path) -> None:
    cap = cv2.VideoCapture(str(cover_path))
    if not cap.isOpened():
        raise ValueError("Unable to read video carrier")

    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    indices = _select_frame_indices(total_frames)
    frame_map_bytes = _encode_frame_map(indices)
    frame_map_bits = []
    for byte in frame_map_bytes:
        for shift in range(7, -1, -1):
            frame_map_bits.append((byte >> shift) & 1)

    full_bits = frame_map_bits + payload_bits
    bit_idx = 0
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))

    frame_num = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_num in indices and bit_idx < len(full_bits):
            remaining = full_bits[bit_idx:]
            frame = dst_image.hide_in_image(frame, remaining)
            bits_used = min(len(remaining), _bits_per_frame(height, width))
            bit_idx += bits_used
        writer.write(frame)
        frame_num += 1

    cap.release()
    writer.release()

    if bit_idx < len(full_bits):
        raise ValueError("Payload exceeds video carrier capacity")

    _reencode_h264(output_path)


def reveal_from_video(stego_path: Path) -> list[int]:
    cap = cv2.VideoCapture(str(stego_path))
    if not cap.isOpened():
        raise ValueError("Unable to read stego video")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    map_bits_needed = FRAME_HEADER_SIZE * 8
    collected: list[int] = []
    frame_num = 0

    while len(collected) < map_bits_needed:
        ret, frame = cap.read()
        if not ret:
            raise ValueError("Corrupted stego video — frame map incomplete")
        if frame_num % VIDEO_KEYFRAME_INTERVAL == 0:
            chunk = dst_image.reveal_from_image(
                frame, min(map_bits_needed - len(collected), _bits_per_frame(height, width))
            )
            collected.extend(chunk)
        frame_num += 1

    map_bytes = bytearray()
    for i in range(0, map_bits_needed, 8):
        byte = 0
        for j in range(8):
            byte = (byte << 1) | collected[i + j]
        map_bytes.append(byte)

    indices = _decode_frame_map(bytes(map_bytes))
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    frame_num = 0
    payload_bits: list[int] = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_num in indices:
            payload_bits.extend(dst_image.reveal_from_image(frame, _bits_per_frame(height, width)))
        frame_num += 1

    cap.release()
    return payload_bits


def _reencode_h264(path: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        return

    temp_path = path.with_suffix(".h264.mp4")
    try:
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-i",
                str(path),
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-preset",
                "medium",
                str(temp_path),
            ],
            check=True,
            capture_output=True,
        )
        temp_path.replace(path)
    except (subprocess.CalledProcessError, OSError):
        if temp_path.exists():
            temp_path.unlink()
