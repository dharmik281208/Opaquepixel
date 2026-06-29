import shutil
from pathlib import Path

from config import TEMP_DIR


def make_temp_dir() -> Path:
    path = TEMP_DIR / f"job_{id(object())}"
    path.mkdir(parents=True, exist_ok=True)
    return path


def cleanup_path(path: Path) -> None:
    if path.exists():
        if path.is_dir():
            shutil.rmtree(path, ignore_errors=True)
        else:
            path.unlink(missing_ok=True)
