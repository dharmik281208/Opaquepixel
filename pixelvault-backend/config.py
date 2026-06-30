import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = Path(os.getenv("TEMP_DIR", BASE_DIR / "tmp"))
TEMP_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 500 * 1024 * 1024))
MAX_TEXT_SIZE = 100 * 1024

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://opaquepixel.app,https://www.opaquepixel.app,https://dharmik281208.github.io",
    ).split(",")
    if origin.strip()
]

CARRIER_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
CARRIER_VIDEO_EXTENSIONS = {".mp4"}
CARRIER_DOCUMENT_EXTENSIONS = {
    ".pdf", ".docx", ".pptx", ".xlsx",
    ".odt", ".ods", ".odp", ".odg",
    ".rtf", ".txt", ".csv", ".md", ".html", ".htm", ".xml",
}
CARRIER_AUDIO_EXTENSIONS = {
    ".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac",
    ".wma", ".opus", ".aiff", ".aif", ".weba",
}
PAYLOAD_DOCUMENT_EXTENSIONS = {".pdf", ".docx", ".pptx", ".xlsx", ".odt", ".ods", ".odp", ".rtf", ".txt", ".csv", ".md"}
PAYLOAD_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
PAYLOAD_AUDIO_EXTENSIONS = CARRIER_AUDIO_EXTENSIONS
PAYLOAD_VIDEO_EXTENSIONS = {".mp4"}

VIDEO_KEYFRAME_INTERVAL = 5
VIDEO_CRF = 18

# Auth — HMAC-signed QR (generate via scripts/generate_auth_qr.py)
AUTH_INSTALL_ID = os.getenv("AUTH_INSTALL_ID", "dev-install-change-me")
AUTH_SECRET = os.getenv("AUTH_SECRET", "opaquepixel-session-secret-change-in-production")
SESSION_TTL_SECONDS = int(os.getenv("SESSION_TTL_SECONDS", 86400))

ASSETS_DIR = BASE_DIR / "assets"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
AUTH_QR_PATH = ASSETS_DIR / "opaquepixel_auth_qr.png"
