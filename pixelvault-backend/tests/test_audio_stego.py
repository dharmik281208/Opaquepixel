from engines.audio_stego import hide_in_audio, reveal_from_audio
from engines.payload import package_payload, unpackage_payload


def test_mp3_carrier_roundtrip():
    carrier = b"ID3fake-mp3-header" + b"\x00" * 128
    secret = b"hidden in music"
    packaged = package_payload(secret, "note.txt", "text/plain", "testpassword123")
    stego = hide_in_audio(carrier, packaged, ".mp3")
    revealed_packaged = reveal_from_audio(stego, ".mp3")
    data, filename, mime = unpackage_payload(revealed_packaged, "testpassword123")
    assert data == secret
    assert filename == "note.txt"


def test_wav_carrier_roundtrip():
    carrier = b"RIFF" + b"\x00" * 64 + b"WAVEfmt "
    packaged = package_payload(b"wav test", "ping.txt", "text/plain", "testpassword123")
    stego = hide_in_audio(carrier, packaged, ".wav")
    revealed_packaged = reveal_from_audio(stego, ".wav")
    data, _, _ = unpackage_payload(revealed_packaged, "testpassword123")
    assert data == b"wav test"
