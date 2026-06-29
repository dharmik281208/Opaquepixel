import hashlib
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

PBKDF2_ITERATIONS = 600_000


def derive_key(password: str, salt: bytes) -> bytes:
    """Derive 32-byte AES key from password using PBKDF2-HMAC-SHA256."""
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
        dklen=32,
    )


def encrypt_payload(data: bytes, password: str) -> bytes:
    """Encrypt bytes with AES-256-GCM. Returns salt+nonce+ciphertext."""
    salt = os.urandom(16)
    nonce = os.urandom(12)
    key = derive_key(password, salt)
    ct = AESGCM(key).encrypt(nonce, data, None)
    return salt + nonce + ct


def decrypt_payload(blob: bytes, password: str) -> bytes:
    """Decrypt AES-256-GCM blob. Raises ValueError on wrong password."""
    if len(blob) < 28:
        raise ValueError("Wrong password or corrupted data")
    salt, nonce, ct = blob[:16], blob[16:28], blob[28:]
    key = derive_key(password, salt)
    try:
        return AESGCM(key).decrypt(nonce, ct, None)
    except Exception as exc:
        raise ValueError("Wrong password or corrupted data") from exc
