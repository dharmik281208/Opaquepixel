"""Generate the pre-built Opaque Pixel auth QR code (admin distribution only)."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import qrcode

from config import AUTH_QR_PATH
from utils.auth import build_signed_qr_payload

payload = build_signed_qr_payload()

qr = qrcode.QRCode(version=1, box_size=10, border=4, error_correction=qrcode.constants.ERROR_CORRECT_H)
qr.add_data(payload)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(AUTH_QR_PATH)
print(f"Auth QR saved to: {AUTH_QR_PATH}")
print("Distribute this file offline to authorized users only.")
print("Set AUTH_SECRET and AUTH_INSTALL_ID in production before generating.")
