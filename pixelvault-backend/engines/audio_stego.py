"""Append-based steganography for audio carriers."""

from config import CARRIER_AUDIO_EXTENSIONS, MAX_FILE_SIZE

MAGIC = b"PXVLT\x01"


def _pack_append(payload: bytes) -> bytes:
    return MAGIC + len(payload).to_bytes(4, "big") + payload


def _unpack_append(data: bytes) -> bytes:
    idx = data.rfind(MAGIC)
    if idx == -1:
        raise ValueError("No hidden payload found in audio file")
    offset = idx + len(MAGIC)
    if offset + 4 > len(data):
        raise ValueError("Corrupted stego audio file")
    length = int.from_bytes(data[offset : offset + 4], "big")
    start = offset + 4
    end = start + length
    if end > len(data):
        raise ValueError("Corrupted stego audio file")
    return data[start:end]


def hide_in_audio(carrier: bytes, payload: bytes, ext: str) -> bytes:
    ext = ext.lower()
    if ext not in CARRIER_AUDIO_EXTENSIONS:
        raise ValueError(f"Unsupported audio carrier format: {ext}")
    return carrier + _pack_append(payload)


def reveal_from_audio(stego: bytes, ext: str) -> bytes:
    ext = ext.lower()
    if ext not in CARRIER_AUDIO_EXTENSIONS:
        raise ValueError(f"Unsupported audio carrier format: {ext}")
    return _unpack_append(stego)


def get_audio_capacity_bytes(carrier_size: int, max_total: int = MAX_FILE_SIZE) -> int:
    overhead = 64 * 1024
    return max(0, max_total - carrier_size - overhead)


def get_carrier_mime(ext: str) -> str:
    ext = ext.lower()
    mime_map = {
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".flac": "audio/flac",
        ".ogg": "audio/ogg",
        ".m4a": "audio/mp4",
        ".aac": "audio/aac",
        ".wma": "audio/x-ms-wma",
        ".opus": "audio/opus",
        ".aiff": "audio/aiff",
        ".aif": "audio/aiff",
        ".weba": "audio/webm",
    }
    return mime_map.get(ext, "application/octet-stream")
