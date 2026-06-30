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
    
    # Pad payload_bits with zeros to make it a multiple of 3
    remainder = len(payload_bits) % 3
    if remainder != 0:
        payload_bits = payload_bits + [0] * (3 - remainder)
        
    bits_arr = np.array(payload_bits, dtype=np.uint8)
    N = len(bits_arr) // 3
    
    if 7 * N > len(flat):
        raise ValueError("Payload exceeds Matrix carrier capacity")
        
    # Reshape payload bits into N blocks of 3 bits
    payload_matrix = bits_arr.reshape((N, 3))
    target_syndromes = (payload_matrix[:, 0].astype(np.int32) << 2) | \
                       (payload_matrix[:, 1].astype(np.int32) << 1) | \
                       payload_matrix[:, 2].astype(np.int32)
                       
    # Slice the first 7 * N subpixels and reshape into N blocks of 7 LSBs
    block_lsbs = (flat[:7 * N].reshape((N, 7)) & 1).astype(np.int32)
    
    # Calculate current syndromes using Hamming matrix logic
    s1 = block_lsbs[:, 3] ^ block_lsbs[:, 4] ^ block_lsbs[:, 5] ^ block_lsbs[:, 6]
    s2 = block_lsbs[:, 1] ^ block_lsbs[:, 2] ^ block_lsbs[:, 5] ^ block_lsbs[:, 6]
    s3 = block_lsbs[:, 0] ^ block_lsbs[:, 2] ^ block_lsbs[:, 4] ^ block_lsbs[:, 6]
    current_syndromes = (s1 << 2) | (s2 << 1) | s3
    
    diffs = target_syndromes ^ current_syndromes
    modify_mask = diffs > 0
    
    if np.any(modify_mask):
        # Calculate flat indices of subpixels whose LSB needs to be flipped
        flip_indices = 7 * np.arange(N)[modify_mask] + (diffs[modify_mask] - 1)
        flat[flip_indices] ^= 1

    modified = _unflatten_pixels(flat, rgb.shape)
    return cv2.cvtColor(modified, cv2.COLOR_RGB2BGR)


def reveal_from_image(stego_bgr: np.ndarray, num_bits: int) -> list[int]:
    if stego_bgr is None or stego_bgr.size == 0:
        raise ValueError("Invalid stego image provided for Matrix extraction")
        
    flat = _flatten_pixels(stego_bgr)
    N = (num_bits + 2) // 3
    
    if 7 * N > len(flat):
        N = len(flat) // 7
        
    block_lsbs = (flat[:7 * N].reshape((N, 7)) & 1).astype(np.int32)
    s1 = block_lsbs[:, 3] ^ block_lsbs[:, 4] ^ block_lsbs[:, 5] ^ block_lsbs[:, 6]
    s2 = block_lsbs[:, 1] ^ block_lsbs[:, 2] ^ block_lsbs[:, 5] ^ block_lsbs[:, 6]
    s3 = block_lsbs[:, 0] ^ block_lsbs[:, 2] ^ block_lsbs[:, 4] ^ block_lsbs[:, 6]
    
    bits_matrix = np.column_stack((s1, s2, s3)).astype(np.uint8)
    return bits_matrix.flatten()[:num_bits].tolist()


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
