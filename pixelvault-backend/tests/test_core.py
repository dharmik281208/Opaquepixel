import numpy as np
import pytest

from engines.crypto import decrypt_payload, encrypt_payload
from engines.payload import (
    bytes_to_bits,
    package_payload,
    prepend_length_header,
    bits_to_bytes,
    extract_length_header,
    unpackage_payload,
)
from engines import image_stego, lsb_image_stego


from fastapi import HTTPException
from utils.validators import validate_password


def test_validate_password():
    # Valid password
    validate_password("Secret123!")

    # Missing length
    with pytest.raises(HTTPException):
        validate_password("Sec1!")

    # Missing uppercase
    with pytest.raises(HTTPException):
        validate_password("secret123!")

    # Missing lowercase
    with pytest.raises(HTTPException):
        validate_password("SECRET123!")

    # Missing number
    with pytest.raises(HTTPException):
        validate_password("SecretPass!")

    # Missing special character
    with pytest.raises(HTTPException):
        validate_password("SecretPass123")


def test_encryption_roundtrip():
    data = b"Hello PixelVault"
    blob = encrypt_payload(data, "test-password-123")
    assert decrypt_payload(blob, "test-password-123") == data


def test_encryption_wrong_password():
    blob = encrypt_payload(b"secret", "correct-password")
    with pytest.raises(ValueError):
        decrypt_payload(blob, "wrong-password")


def test_payload_roundtrip():
    original = b"Test document content"
    packaged = package_payload(original, "report.pdf", "application/pdf", "secure-pass-123")
    bits = prepend_length_header(bytes_to_bits(packaged))
    length, extracted_bits = extract_length_header(bits)
    recovered = bits_to_bytes(extracted_bits)
    data, filename, mime = unpackage_payload(recovered, "secure-pass-123")
    assert data == original
    assert filename == "report.pdf"
    assert mime == "application/pdf"


def test_lsb_image_roundtrip():
    cover = np.zeros((64, 64, 3), dtype=np.uint8)
    cover[:, :, 0] = 128
    cover[:, :, 1] = 64
    cover[:, :, 2] = 200
    payload = package_payload(b"Hidden message", "msg.txt", "text/plain", "password1234")
    bits = prepend_length_header(bytes_to_bits(payload))
    stego = lsb_image_stego.hide_in_image(cover, bits)
    length = len(bits)
    extracted = lsb_image_stego.reveal_from_image(stego, length)
    _, payload_bits = extract_length_header(extracted)
    data, _, _ = unpackage_payload(bits_to_bytes(payload_bits), "password1234")
    assert data == b"Hidden message"


def test_dst_image_roundtrip():
    cover = np.random.randint(0, 256, (512, 512, 3), dtype=np.uint8)
    payload = package_payload(b"DST test payload", "test.txt", "text/plain", "password1234")
    bits = prepend_length_header(bytes_to_bits(payload))
    stego = image_stego.hide_in_image(cover, bits)
    length = len(bits)
    extracted = image_stego.reveal_from_image(stego, length)
    _, payload_bits = extract_length_header(extracted)
    data, _, _ = unpackage_payload(bits_to_bytes(payload_bits), "password1234")
    assert data == b"DST test payload"
