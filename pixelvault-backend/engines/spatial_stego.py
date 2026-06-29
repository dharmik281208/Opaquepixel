"""
Authentic Spatial Domain Steganography Engine

Operates directly on spatial Green and Blue color channel matrices using spatial bit-plane manipulation.
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


def get_spatial_capacity_bytes(image_bgr: np.ndarray) -> int:
    if image_bgr is None or image_bgr.size == 0:
        return 0
    h, w, c = image_bgr.shape
    # Embed across Green (1) and Blue (0) channels in spatial domain
    spatial_subpixels = h * w * 2
    return max(0, (spatial_subpixels - 32) // 8)


def hide_in_image(cover_bgr: np.ndarray, payload_bits: list[int]) -> np.ndarray:
    if cover_bgr is None or cover_bgr.size == 0:
        raise ValueError("Invalid cover image provided for Spatial embedding")
        
    stego_bgr = cover_bgr.copy()
    h, w, c = stego_bgr.shape
    
    # Extract spatial Green and Blue channels
    gb_channels = stego_bgr[:, :, [0, 1]].flatten().astype(np.uint8)
    n = len(payload_bits)
    
    if n > len(gb_channels):
        raise ValueError("Payload exceeds Spatial carrier capacity")

    bits_arr = np.array(payload_bits, dtype=np.uint8)
    gb_channels[:n] = (gb_channels[:n] & 0xFE) | bits_arr

    stego_bgr[:, :, [0, 1]] = gb_channels.reshape((h, w, 2))
    return stego_bgr


def reveal_from_image(stego_bgr: np.ndarray, num_bits: int) -> list[int]:
    if stego_bgr is None or stego_bgr.size == 0:
        raise ValueError("Invalid stego image provided for Spatial extraction")
        
    gb_channels = stego_bgr[:, :, [0, 1]].flatten()
    if num_bits > len(gb_channels):
        num_bits = len(gb_channels)
        
    return (gb_channels[:num_bits] & 1).tolist()


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

    capacity_bytes = get_spatial_capacity_bytes(cover)
    if len(payload_bits) > capacity_bytes * 8:
        raise ValueError("Payload exceeds Spatial carrier capacity")

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

    h, w, c = stego.shape
    max_bits = (h * w * 2) - 32

    header_bits = reveal_from_image(stego, 32)
    length = 0
    for bit in header_bits:
        length = (length << 1) | bit

    if length < 0 or length > max_bits:
        raise ValueError("Invalid or corrupted stego image (payload length exceeds Spatial capacity)")

    all_bits = reveal_from_image(stego, 32 + length)
    _, payload_bits = extract_length_header(all_bits)
    payload_bytes = bits_to_bytes(payload_bits)

    return unpackage_payload(payload_bytes, password)
