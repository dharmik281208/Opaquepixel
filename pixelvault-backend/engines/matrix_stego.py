"""
Authentic Hamming (7,4) Matrix Steganography Engine

Embeds 3 secret payload bits into every block of 7 subpixel LSBs using parity matrices,
modifying at most 1 subpixel bit per block for high visual fidelity and security.
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
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    return rgb.flatten()


def _unflatten_pixels(flat: np.ndarray, shape: tuple[int, int, int]) -> np.ndarray:
    return flat.reshape(shape)


def get_matrix_capacity_bytes(image_bgr: np.ndarray) -> int:
    if image_bgr is None or image_bgr.size == 0:
        return 0
    h, w, c = image_bgr.shape
    total_subpixels = h * w * c
    num_blocks = total_subpixels // 7
    total_bits = num_blocks * 3
    return max(0, (total_bits - 32) // 8)


def hide_in_image(cover_bgr: np.ndarray, payload_bits: list[int]) -> np.ndarray:
    if cover_bgr is None or cover_bgr.size == 0:
        raise ValueError("Invalid cover image provided for Matrix embedding")
        
    rgb = cv2.cvtColor(cover_bgr, cv2.COLOR_BGR2RGB)
    flat = rgb.flatten().astype(np.uint8)
    n_pixels = len(flat)
    
    bit_idx = 0
    total_bits = len(payload_bits)
    
    # Process in blocks of 7 subpixels (embedding 3 bits per block)
    for i in range(0, n_pixels - 6, 7):
        if bit_idx >= total_bits:
            break

        # Extract 3 bits to embed
        chunk = payload_bits[bit_idx : bit_idx + 3]
        actual_k = len(chunk)
        if actual_k < 3:
            # Pad with zeros if at the very end
            chunk = chunk + [0] * (3 - actual_k)
            
        m1, m2, m3 = chunk[0], chunk[1], chunk[2]
        target_syndrome = (m1 << 2) | (m2 << 1) | m3

        # Extract current 7 LSBs
        block_lsbs = flat[i : i + 7] & 1
        
        # Calculate current syndrome using Hamming H matrix
        v1, v2, v3, v4, v5, v6, v7 = [int(x) for x in block_lsbs]
        s1 = v4 ^ v5 ^ v6 ^ v7
        s2 = v2 ^ v3 ^ v6 ^ v7
        s3 = v1 ^ v3 ^ v5 ^ v7
        current_syndrome = (s1 << 2) | (s2 << 1) | s3

        diff = int(target_syndrome ^ current_syndrome)
        if diff > 0:
            # Flip the LSB of subpixel at index (diff - 1)
            flip_idx = i + (diff - 1)
            flat[flip_idx] = flat[flip_idx] ^ 1

        bit_idx += actual_k

    modified = _unflatten_pixels(flat, rgb.shape)
    return cv2.cvtColor(modified, cv2.COLOR_RGB2BGR)


def reveal_from_image(stego_bgr: np.ndarray, num_bits: int) -> list[int]:
    if stego_bgr is None or stego_bgr.size == 0:
        raise ValueError("Invalid stego image provided for Matrix extraction")
        
    flat = _flatten_pixels(stego_bgr)
    n_pixels = len(flat)
    extracted_bits: list[int] = []

    for i in range(0, n_pixels - 6, 7):
        if len(extracted_bits) >= num_bits:
            break

        block_lsbs = flat[i : i + 7] & 1
        v1, v2, v3, v4, v5, v6, v7 = [int(x) for x in block_lsbs]
        s1 = v4 ^ v5 ^ v6 ^ v7
        s2 = v2 ^ v3 ^ v6 ^ v7
        s3 = v1 ^ v3 ^ v5 ^ v7
        
        chunk = [int(s1), int(s2), int(s3)]
        rem = num_bits - len(extracted_bits)
        extracted_bits.extend(chunk[:rem])

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

    capacity_bytes = get_matrix_capacity_bytes(cover)
    if len(payload_bits) > capacity_bytes * 8:
        raise ValueError("Payload exceeds Matrix carrier capacity")

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

    max_bits = get_matrix_capacity_bytes(stego) * 8 - 32
    if length < 0 or length > max_bits:
        raise ValueError("Invalid or corrupted stego image (payload length exceeds Matrix capacity)")

    all_bits = reveal_from_image(stego, 32 + length)
    _, payload_bits = extract_length_header(all_bits)
    payload_bytes = bits_to_bytes(payload_bits)

    return unpackage_payload(payload_bytes, password)
