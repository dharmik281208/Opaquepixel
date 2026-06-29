import io
import zipfile

import pytest

from engines.crypto import encrypt_payload, decrypt_payload
from engines.document_stego import hide_in_document, reveal_from_document
from engines.payload import package_payload, unpackage_payload


def _minimal_docx() -> bytes:
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w") as zf:
        zf.writestr("[Content_Types].xml", '<?xml version="1.0"?><Types/>')
        zf.writestr("word/document.xml", "<w:document/>")
    return out.getvalue()


def _minimal_pdf() -> bytes:
    return b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"


def test_document_docx_roundtrip():
    carrier = _minimal_docx()
    packaged = package_payload(b"Secret in DOCX", "note.txt", "text/plain", "password1234")
    stego = hide_in_document(carrier, packaged, ".docx")
    extracted = reveal_from_document(stego, ".docx")
    data, _, _ = unpackage_payload(extracted, "password1234")
    assert data == b"Secret in DOCX"


def test_document_pdf_roundtrip():
    carrier = _minimal_pdf()
    packaged = package_payload(b"Secret in PDF", "note.txt", "text/plain", "password1234")
    stego = hide_in_document(carrier, packaged, ".pdf")
    extracted = reveal_from_document(stego, ".pdf")
    data, _, _ = unpackage_payload(extracted, "password1234")
    assert data == b"Secret in PDF"


def test_document_txt_roundtrip():
    carrier = b"Hello, this is a plain text document.\n"
    packaged = package_payload(b"Hidden line", "secret.txt", "text/plain", "password1234")
    stego = hide_in_document(carrier, packaged, ".txt")
    extracted = reveal_from_document(stego, ".txt")
    data, _, _ = unpackage_payload(extracted, "password1234")
    assert data == b"Hidden line"
