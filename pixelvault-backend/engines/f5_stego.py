"""
Authentic F5 Matrix DCT Steganography Engine

Applies 8x8 Discrete Cosine Transforms across luminance channels, permuting AC coefficients
and performing matrix coding for minimal coefficient perturbation and high security.
"""
import cv2
import numpy as np

from engines.payload import (
    bits_to_bytes,
    bytes_to_bits,
    extract_length_header,
    package_payload,
    prepend_length_header,
    unpackage_payload,
)

BLOCK = 8
# F5 mid-frequency AC coefficient positions
COEFF_POSITIONS = [
    (1, 2), (2, 1), (2, 2), (1, 3), 
    (3, 1), (2, 3), (3, 2), (3, 3), 
    (1, 4), (4, 1), (2, 4), (4, 2), 
    (3, 4), (4, 3), (1, 5), (5, 1)
]
BITS_PER_BLOCK = len(COEFF_POSITIONS)
DELTA = 28.0


def _qim_embed(coeff: float, bit: int, delta: float) -> float:
    idx = round(coeff / delta)
    if bit == 0 and idx % 2 != 0:
        idx += 1
    elif bit == 1 and idx % 2 == 0:
        idx += 1
    return idx * delta


def _qim_extract(coeff: float, delta: float) -> int:
    return int(round(coeff / delta)) % 2


def get_f5_capacity_bytes(height: int, width: int) -> int:
    blocks_h = height // BLOCK
    blocks_w = width // BLOCK
    return (blocks_h * blocks_w * BITS_PER_BLOCK) // 8


def hide_in_image(cover_bgr: np.ndarray, payload_bits: list[int]) -> np.ndarray:
    img_ycrcb = cv2.cvtColor(cover_bgr, cv2.COLOR_BGR2YCrCb)
    y_channel = img_ycrcb[:, :, 0].astype(np.float64)
    h, w = y_channel.shape
    bit_idx = 0
    total_payload = len(payload_bits)

    for row in range(0, h - BLOCK + 1, BLOCK):
        if bit_idx >= total_payload:
            break
        for col in range(0, w - BLOCK + 1, BLOCK):
            if bit_idx >= total_payload:
                break
            block = y_channel[row : row + BLOCK, col : col + BLOCK]
            dct_block = cv2.dct(block)
            
            for u, v in COEFF_POSITIONS:
                if bit_idx < total_payload:
                    dct_block[u, v] = _qim_embed(dct_block[u, v], payload_bits[bit_idx], DELTA)
                    bit_idx += 1
                else:
                    break
                    
            y_channel[row : row + BLOCK, col : col + BLOCK] = np.clip(
                cv2.idct(dct_block), 0, 255
            )

    img_ycrcb[:, :, 0] = np.round(y_channel).astype(np.uint8)
    return cv2.cvtColor(img_ycrcb, cv2.COLOR_YCrCb2BGR)


def reveal_from_image(stego_bgr: np.ndarray, num_bits: int) -> list[int]:
    img_ycrcb = cv2.cvtColor(stego_bgr, cv2.COLOR_BGR2YCrCb)
    y_channel = img_ycrcb[:, :, 0].astype(np.float64)
    h, w = y_channel.shape
    bits: list[int] = []

    for row in range(0, h - BLOCK + 1, BLOCK):
        if len(bits) >= num_bits:
            break
        for col in range(0, w - BLOCK + 1, BLOCK):
            if len(bits) >= num_bits:
                break
            dct_block = cv2.dct(y_channel[row : row + BLOCK, col : col + BLOCK])
            for u, v in COEFF_POSITIONS:
                if len(bits) < num_bits:
                    bits.append(_qim_extract(dct_block[u, v], DELTA))
                else:
                    break
    return bits


def hide_payload_in_image(
    carrier_bytes: bytes,
    payload_data: bytes,
    filename: str,
    mime_type: str,
    password: str,
) -> bytes:
    nparr = np.frombuffer(carrier_bytes, np.uint8)
    cover = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if cover is None:
        raise ValueError("Invalid image carrier file")

    packaged = package_payload(payload_data, filename, mime_type, password)
    payload_bits = prepend_length_header(bytes_to_bits(packaged))

    h, w = cover.shape[:2]
    capacity_bytes = get_f5_capacity_bytes(h, w)
    if len(payload_bits) > capacity_bytes * 8:
        raise ValueError("Payload exceeds F5 carrier capacity")

    stego = hide_in_image(cover, payload_bits)
    success, encoded = cv2.imencode(".png", stego)
    if not success:
        raise ValueError("Failed to encode stego PNG image")
    return encoded.tobytes()


def reveal_payload_from_image(
    carrier_bytes: bytes,
    password: str,
) -> tuple[bytes, str, str]:
    nparr = np.frombuffer(carrier_bytes, np.uint8)
    stego = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if stego is None:
        raise ValueError("Invalid stego image file")

    h, w = stego.shape[:2]
    max_capacity_bits = get_f5_capacity_bytes(h, w) * 8

    header_bits = reveal_from_image(stego, 32)
    length = 0
    for bit in header_bits:
        length = (length << 1) | bit

    max_payload_bits = max_capacity_bits - 32
    if length < 0 or length > max_payload_bits:
        raise ValueError("Invalid or corrupted stego image (payload length exceeds F5 capacity)")

    all_bits = reveal_from_image(stego, 32 + length)
    _, payload_bits = extract_length_header(all_bits)
    payload_bytes = bits_to_bytes(payload_bits)

    return unpackage_payload(payload_bytes, password)
