"""
LSB (Least Significant Bit) Image Steganography Mechanism

Complete, robust structure supporting all upload payload types (text, document, 
image, video, audio) inside image carriers using NumPy vectorized bit manipulation.
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


def _flatten_pixels(image_bgr: np.ndarray) -> np.ndarray:
    """Convert BGR image to RGB and flatten into a 1D uint8 array of subpixels."""
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    return rgb.flatten()


def _unflatten_pixels(flat: np.ndarray, shape: tuple[int, int, int]) -> np.ndarray:
    """Reshape 1D subpixel array back to RGB image tensor."""
    return flat.reshape(shape)


def get_lsb_capacity_bytes(image_bgr: np.ndarray) -> int:
    """Calculate maximum payload byte capacity for LSB steganography."""
    if image_bgr is None or image_bgr.size == 0:
        return 0
    h, w, c = image_bgr.shape
    total_subpixels = h * w * c
    return max(0, (total_subpixels - 32) // 8)


def hide_in_image(cover_bgr: np.ndarray, payload_bits: list[int]) -> np.ndarray:
    """
    Embed a list of binary bits into the least significant bits of cover_bgr.
    """
    if cover_bgr is None or cover_bgr.size == 0:
        raise ValueError("Invalid cover image provided for LSB embedding")
        
    rgb = cv2.cvtColor(cover_bgr, cv2.COLOR_BGR2RGB)
    flat = rgb.flatten().astype(np.uint8)
    n = len(payload_bits)
    
    if n > len(flat):
        raise ValueError("Payload exceeds LSB carrier capacity")

    bits_arr = np.array(payload_bits, dtype=np.uint8)
    flat[:n] = (flat[:n] & 0xFE) | bits_arr

    modified = _unflatten_pixels(flat, rgb.shape)
    return cv2.cvtColor(modified, cv2.COLOR_RGB2BGR)


def reveal_from_image(stego_bgr: np.ndarray, num_bits: int) -> list[int]:
    """
    Extract specified number of LSB bits from stego_bgr image.
    """
    if stego_bgr is None or stego_bgr.size == 0:
        raise ValueError("Invalid stego image provided for LSB extraction")
        
    flat = _flatten_pixels(stego_bgr)
    if num_bits > len(flat):
        num_bits = len(flat)
        
    return (flat[:num_bits] & 1).tolist()


def hide_payload_in_image(
    carrier_bytes: bytes,
    payload_data: bytes,
    filename: str,
    mime_type: str,
    password: str,
) -> bytes:
    """
    High-level handler to hide ANY upload type (text, document, image, video, audio)
    inside an image carrier using LSB steganography.
    """
    nparr = np.frombuffer(carrier_bytes, np.uint8)
    cover = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if cover is None:
        raise ValueError("Invalid image carrier file")

    packaged = package_payload(payload_data, filename, mime_type, password)
    payload_bits = prepend_length_header(bytes_to_bits(packaged))

    capacity_bytes = get_lsb_capacity_bytes(cover)
    if len(payload_bits) > capacity_bytes * 8:
        raise ValueError("Payload exceeds LSB carrier capacity")

    stego = hide_in_image(cover, payload_bits)
    success, encoded = cv2.imencode(".png", stego)
    if not success:
        raise ValueError("Failed to encode stego PNG image")
    return encoded.tobytes()


def reveal_payload_from_image(
    carrier_bytes: bytes,
    password: str,
) -> tuple[bytes, str, str]:
    """
    High-level handler to extract ANY hidden payload from an LSB image stego carrier.
    """
    nparr = np.frombuffer(carrier_bytes, np.uint8)
    stego = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if stego is None:
        raise ValueError("Invalid stego image file")

    flat = _flatten_pixels(stego)
    probe_bits = (flat[:32] & 1).tolist()
    length = 0
    for bit in probe_bits:
        length = (length << 1) | bit

    max_bits = len(flat) - 32
    if length < 0 or length > max_bits:
        raise ValueError("Invalid or corrupted stego image (length header exceeds capacity)")

    all_bits = reveal_from_image(stego, 32 + length)
    _, payload_bits = extract_length_header(all_bits)
    payload_bytes = bits_to_bytes(payload_bits)

    return unpackage_payload(payload_bytes, password)



