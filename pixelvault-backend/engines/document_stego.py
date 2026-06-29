import io
import zipfile

MAGIC = b"PXVLT\x01"
ZIP_ENTRY = "_pixelvault/stego.dat"

ZIP_EXTENSIONS = {".docx", ".pptx", ".xlsx", ".odt", ".ods", ".odp", ".odg"}
APPEND_EXTENSIONS = {".pdf", ".rtf", ".txt", ".csv", ".md", ".html", ".htm", ".xml"}

CARRIER_DOCUMENT_EXTENSIONS = ZIP_EXTENSIONS | APPEND_EXTENSIONS


def _pack_append(payload: bytes) -> bytes:
    return MAGIC + len(payload).to_bytes(4, "big") + payload


def _unpack_append(data: bytes) -> bytes:
    idx = data.rfind(MAGIC)
    if idx == -1:
        raise ValueError("No hidden payload found in document")
    offset = idx + len(MAGIC)
    if offset + 4 > len(data):
        raise ValueError("Corrupted stego document")
    length = int.from_bytes(data[offset : offset + 4], "big")
    start = offset + 4
    end = start + length
    if end > len(data):
        raise ValueError("Corrupted stego document")
    return data[start:end]


def _hide_in_zip(carrier: bytes, payload: bytes) -> bytes:
    inp = io.BytesIO(carrier)
    out = io.BytesIO()
    with zipfile.ZipFile(inp, "r") as zin:
        with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == ZIP_ENTRY:
                    continue
                zout.writestr(item, zin.read(item.filename))
            zout.writestr(ZIP_ENTRY, payload)
    return out.getvalue()


def _reveal_from_zip(stego: bytes) -> bytes:
    with zipfile.ZipFile(io.BytesIO(stego), "r") as zf:
        if ZIP_ENTRY not in zf.namelist():
            raise ValueError("No hidden payload found in document")
        return zf.read(ZIP_ENTRY)


def _hide_in_pdf(carrier: bytes, payload: bytes) -> bytes:
    packed = _pack_append(payload)
    eof = carrier.rfind(b"%%EOF")
    if eof != -1:
        insert_at = eof + 5
        while insert_at < len(carrier) and carrier[insert_at : insert_at + 1] in (b"\r", b"\n"):
            insert_at += 1
        return carrier[:insert_at] + b"\n" + packed
    return carrier + b"\n" + packed


def hide_in_document(carrier: bytes, payload: bytes, ext: str) -> bytes:
    ext = ext.lower()
    if ext in ZIP_EXTENSIONS:
        return _hide_in_zip(carrier, payload)
    if ext == ".pdf":
        return _hide_in_pdf(carrier, payload)
    if ext in APPEND_EXTENSIONS:
        return carrier + _pack_append(payload)
    raise ValueError(f"Unsupported document carrier format: {ext}")


def reveal_from_document(stego: bytes, ext: str) -> bytes:
    ext = ext.lower()
    if ext in ZIP_EXTENSIONS:
        return _reveal_from_zip(stego)
    if ext in APPEND_EXTENSIONS or ext == ".pdf":
        return _unpack_append(stego)
    raise ValueError(f"Unsupported document carrier format: {ext}")


def get_document_capacity_bytes(carrier_size: int, max_total: int) -> int:
    overhead = 64 * 1024
    return max(0, max_total - carrier_size - overhead)


def get_carrier_mime(ext: str) -> str:
    ext = ext.lower()
    mime_map = {
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".ods": "application/vnd.oasis.opendocument.spreadsheet",
        ".odp": "application/vnd.oasis.opendocument.presentation",
        ".odg": "application/vnd.oasis.opendocument.graphics",
        ".rtf": "application/rtf",
        ".txt": "text/plain",
        ".csv": "text/csv",
        ".md": "text/markdown",
        ".html": "text/html",
        ".htm": "text/html",
        ".xml": "application/xml",
    }
    return mime_map.get(ext, "application/octet-stream")
