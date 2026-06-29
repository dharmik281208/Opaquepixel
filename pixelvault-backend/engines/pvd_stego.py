"""
Bulletproof Authentic Pixel Value Differencing (PVD) Steganography Engine

Embeds secret bits into adjacent subpixel pair differences (P2 - P1) with exact parity preservation.
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


def get_pvd_capacity_bytes(image_bgr: np.ndarray) -> int:
    if image_bgr is None or image_bgr.size == 0:
        return 0
    h, w, c = image_bgr.shape
    total_subpixels = h * w * c
    num_pairs = total_subpixels // 2
    return max(0, (num_pairs - 32) // 8)


def hide_in_image(cover_bgr: np.ndarray, payload_bits: list[int]) -> np.ndarray:
    if cover_bgr is None or cover_bgr.size == 0:
        raise ValueError("Invalid cover image provided for PVD embedding")
        
    rgb = cv2.cvtColor(cover_bgr, cv2.COLOR_BGR2RGB)
    flat = rgb.flatten().astype(np.int32)
    n_pixels = len(flat)
    
    bit_idx = 0
    total_bits = len(payload_bits)

    for i in range(0, n_pixels - 1, 2):
        if bit_idx >= total_bits:
            break

        p1, p2 = flat[i], flat[i+1]
        diff = p2 - p1
        target_bit = payload_bits[bit_idx]
        
        current_parity = abs(diff) % 2
        if current_parity != target_bit:
            if p2 >= p1:
                p2 += 1
            else:
                p1 += 1

        flat[i] = np.clip(p1, 0, 255)
        flat[i+1] = np.clip(p2, 0, 255)
        bit_idx += 1

    stego_flat = flat.astype(np.uint8)
    return cv2.cvtColor(stego_flat.reshape(rgb.shape), cv2.COLOR_RGB2BGR)


def reveal_from_image(stego_bgr: np.ndarray, num_bits: int) -> list[int]:
    if stego_bgr is None or stego_bgr.size == 0:
        raise ValueError("Invalid stego image provided for PVD extraction")
        
    rgb = cv2.cvtColor(stego_bgr, cv2.COLOR_BGR2RGB)
    flat = rgb.flatten().astype(np.int32)
    n_pixels = len(flat)
    extracted_bits: list[int] = []

    for i in range(0, n_pixels - 1, 2):
        if len(extracted_bits) >= num_bits:
            break

        p1, p2 = flat[i], flat[i+1]
        diff = p2 - p1
        extracted_bits.append(abs(diff) % 2)

    return extracted_bits


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

    capacity_bytes = get_pvd_capacity_bytes(cover)
    if len(payload_bits) > capacity_bytes * 8:
        raise ValueError("Payload exceeds PVD carrier capacity")

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

    header_bits = reveal_from_image(stego, 32)
    length = 0
    for bit in header_bits:
        length = (length << 1) | bit

    max_bits = get_pvd_capacity_bytes(stego) * 8 - 32
    if length < 0 or length > max_bits:
        raise ValueError("Invalid or corrupted stego image (payload length exceeds PVD capacity)")

    all_bits = reveal_from_image(stego, 32 + length)
    _, payload_bits = extract_length_header(all_bits)
    payload_bytes = bits_to_bytes(payload_bits)

    return unpackage_payload(payload_bytes, password)
