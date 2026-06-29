import base64
import zlib
import numpy as np

from engines.crypto import decrypt_payload, encrypt_payload

HEADER_SIZE = 32
FILENAME_SIZE = 16
MIME_SIZE = 16


def _pack_header(filename: str, mime_type: str) -> bytes:
    fn = filename.encode("utf-8")[:FILENAME_SIZE].ljust(FILENAME_SIZE, b"\0")
    mime = mime_type.encode("utf-8")[:MIME_SIZE].ljust(MIME_SIZE, b"\0")
    return fn + mime


def package_payload(data: bytes, filename: str, mime_type: str, password: str) -> bytes:
    """Package, compress, encrypt payload. Returns raw bytes ready for bit embedding."""
    header = _pack_header(filename, mime_type)
    compressed = zlib.compress(header + data, level=6)
    return encrypt_payload(compressed, password)


def unpackage_payload(data: bytes, password: str) -> tuple[bytes, str, str]:
    """Decrypt, decompress, and unpack payload metadata."""
    decrypted = decrypt_payload(data, password)
    decompressed = zlib.decompress(decrypted)
    if len(decompressed) < HEADER_SIZE:
        raise ValueError("Corrupted payload header")
    filename = decompressed[:FILENAME_SIZE].rstrip(b"\0").decode("utf-8", errors="replace")
    mime_type = (
        decompressed[FILENAME_SIZE:HEADER_SIZE].rstrip(b"\0").decode("utf-8", errors="replace")
    )
    return decompressed[HEADER_SIZE:], filename, mime_type


def bytes_to_bits(data: bytes) -> list[int]:
    if not data:
        return []
    arr = np.frombuffer(data, dtype=np.uint8)
    bits = np.unpackbits(arr)
    return bits.tolist()


def bits_to_bytes(bits: list[int]) -> bytes:
    if not bits:
        return b""
    remainder = len(bits) % 8
    if remainder != 0:
        bits = bits + [0] * (8 - remainder)
    arr = np.array(bits, dtype=np.uint8)
    packed = np.packbits(arr)
    return packed.tobytes()


def prepend_length_header(bits: list[int]) -> list[int]:
    length = len(bits)
    length_bits = [(length >> shift) & 1 for shift in range(31, -1, -1)]
    return length_bits + bits


def expand_bits_redundant(bits: list[int], factor: int = 1) -> list[int]:
    return list(bits)


def collapse_bits_redundant(bits: list[int], factor: int = 1) -> list[int]:
    return list(bits)


def extract_length_header(bits: list[int]) -> tuple[int, list[int]]:
    if len(bits) < 32:
        raise ValueError("Insufficient data in carrier")
    length = 0
    for i in range(32):
        length = (length << 1) | bits[i]
    if length < 0 or 32 + length > len(bits):
        raise ValueError("Invalid payload length header")
    raw = bits[32 : 32 + length]
    return length, raw

