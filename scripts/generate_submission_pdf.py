"""
Generate Opaque Pixel submission PDF for academic / project presentation.
Usage: python scripts/generate_submission_pdf.py
Output: docs/Opaque_Pixel_Software_Document.pdf
"""

import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "Opaque_Pixel_Software_Document.pdf"


def build_pdf():
    try:
        from fpdf import FPDF
    except ImportError:
        print("Installing fpdf2...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2", "-q"])
        from fpdf import FPDF

    class Doc(FPDF):
        def header(self):
            if self.page_no() > 1:
                self.set_font("Helvetica", "I", 8)
                self.set_text_color(120, 120, 120)
                self.cell(140, 8, "Opaque Pixel - Steganography Platform", align="L")
                self.cell(0, 8, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
                self.ln(2)

        def footer(self):
            self.set_y(-15)
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 10, "Educational and lawful use only", align="C")

        def section_title(self, num, title):
            self.ln(4)
            self.set_font("Helvetica", "B", 14)
            self.set_text_color(30, 30, 40)
            self.cell(0, 10, f"{num}. {title}", new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(168, 85, 247)
            self.set_line_width(0.6)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)

        def sub_title(self, title):
            self.ln(2)
            self.set_font("Helvetica", "B", 11)
            self.set_text_color(50, 50, 60)
            self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
            self.ln(1)

        def body(self, text):
            self.set_x(self.l_margin)
            self.set_font("Helvetica", "", 10)
            self.set_text_color(40, 40, 45)
            self.multi_cell(0, 5.5, text, new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

        def bullet(self, text):
            self.set_x(self.l_margin)
            self.set_font("Helvetica", "", 10)
            self.set_text_color(40, 40, 45)
            self.multi_cell(0, 5.5, f"  -  {text}", new_x="LMARGIN", new_y="NEXT")

        def table_row(self, cols, bold=False):
            self.set_x(self.l_margin)
            self.set_font("Helvetica", "B" if bold else "", 9)
            usable = self.w - self.l_margin - self.r_margin
            w = usable / len(cols)
            for c in cols:
                self.cell(w, 7, str(c), border=1)
            self.ln()

    pdf = Doc()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # Cover
    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(20, 20, 25)
    pdf.ln(40)
    pdf.cell(0, 14, "OPAQUE PIXEL", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 16)
    pdf.set_text_color(80, 80, 90)
    pdf.cell(0, 10, "Advanced Steganography Platform", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)
    pdf.set_font("Helvetica", "I", 11)
    pdf.cell(0, 8, "Software Documentation for Project Submission", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(20)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 7, f"Document date: {date.today().strftime('%B %d, %Y')}", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "Domain: opaquepixel.app", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(30)
    pdf.set_font("Helvetica", "I", 9)
    pdf.multi_cell(
        0,
        5,
        "This document describes the design, architecture, features, and operation of the Opaque Pixel web platform. It is intended for academic submission and as source material for PowerPoint presentation slides.",
        align="C",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.add_page()

    # 1 Abstract
    pdf.section_title("1", "Abstract")
    pdf.body(
        "Opaque Pixel is a web-based steganography platform that allows authorized users to hide "
        "encrypted secret data inside ordinary digital files such as images, videos, and documents. "
        "The system combines modern cryptography (AES-256-GCM), multiple steganographic embedding "
        "techniques (LSB, DST, video frame embedding, document carrier injection), and a secure "
        "QR-based authentication gate. The platform provides a minimalist dark web interface for "
        "non-technical users while maintaining a modular FastAPI backend suitable for research, "
        "cybersecurity education, and lawful privacy applications."
    )

    # 2 Introduction
    pdf.section_title("2", "Introduction")
    pdf.body(
        "Steganography is the practice of concealing information within other non-secret data. "
        "Unlike encryption alone, which makes data unreadable but visible, steganography hides "
        "the very existence of the secret message. Opaque Pixel was developed as a complete "
        "full-stack application demonstrating practical steganography with strong encryption "
        "and user-friendly workflows."
    )
    pdf.sub_title("Problem Statement")
    pdf.body(
        "Users need a reliable way to embed confidential data in everyday file formats without "
        "obvious indicators of hidden content, while ensuring only authorized individuals can "
        "access the platform and only the correct password can recover the payload."
    )
    pdf.sub_title("Objectives")
    for obj in [
        "Build a secure web platform for hiding and revealing encrypted payloads.",
        "Support multiple carrier types: image, video, and document formats.",
        "Implement strong encryption before embedding (AES-256-GCM with PBKDF2).",
        "Provide QR-based authentication for platform access control.",
        "Deliver an intuitive, modern web interface for educational and research use.",
    ]:
        pdf.bullet(obj)

    # 3 System Overview
    pdf.section_title("3", "System Overview")
    pdf.body(
        "Opaque Pixel is a client-server application. The React frontend handles user interaction, "
        "file uploads, and session management. The FastAPI backend performs encryption, "
        "steganographic embedding/extraction, and authentication. All hide and reveal operations "
        "require a valid session token obtained through QR verification."
    )
    pdf.sub_title("Main Modules")
    pdf.table_row(["Module", "Role"], bold=True)
    pdf.table_row(["pixelvault-frontend", "React UI, routing, auth gate, file upload"])
    pdf.table_row(["pixelvault-backend", "REST API, crypto, stego engines"])
    pdf.table_row(["Auth system", "Signed QR verification, HMAC session tokens"])
    pdf.table_row(["Crypto engine", "AES-256-GCM encryption/decryption"])
    pdf.table_row(["Stego engines", "Image, video, document embedding"])

    # 4 Architecture
    pdf.add_page()
    pdf.section_title("4", "System Architecture")
    pdf.body(
        "The architecture follows a three-tier model: Presentation (React + Tailwind CSS), "
        "Application (FastAPI routers and business logic), and Processing (steganography and "
        "cryptography engines). Temporary files are stored during processing and cleaned up "
        "after each request."
    )
    pdf.sub_title("Data Flow - Hide Operation")
    for step in [
        "User uploads carrier file and payload (text or file).",
        "User enters encryption password (minimum 8 characters).",
        "Backend packages payload with metadata and compresses if needed.",
        "Payload is encrypted with AES-256-GCM (PBKDF2 key derivation, 600,000 iterations).",
        "Encrypted blob is embedded into the carrier using the selected stego method.",
        "Modified carrier file is returned to the user for download.",
    ]:
        pdf.bullet(step)
    pdf.sub_title("Data Flow - Reveal Operation")
    for step in [
        "User uploads stego carrier file and enters password.",
        "Backend extracts embedded data using appropriate stego engine.",
        "Data is decrypted; wrong password returns an error.",
        "Original payload is returned (text, file, or document).",
    ]:
        pdf.bullet(step)

    # 5 Technology Stack
    pdf.section_title("5", "Technology Stack")
    pdf.table_row(["Layer", "Technologies"], bold=True)
    pdf.table_row(["Frontend", "React 18, Vite, Tailwind CSS, React Router, Axios"])
    pdf.table_row(["Backend", "Python 3, FastAPI, Uvicorn"])
    pdf.table_row(["Image processing", "OpenCV, NumPy, SciPy, Pillow"])
    pdf.table_row(["Security", "cryptography (AES-GCM), HMAC, PBKDF2, QR codes"])
    pdf.table_row(["Testing", "pytest, FastAPI TestClient"])
    pdf.table_row(["Deployment", "Nginx, Cloudflare Pages, Railway/Render (optional)"])

    # 6 Features
    pdf.section_title("6", "Key Features")
    for f in [
        "Hide encrypted payloads in images (PNG/JPG), videos (MP4), and documents (PDF, DOCX, etc.).",
        "Reveal hidden payloads with password-protected decryption.",
        "Dual image algorithms: LSB (fast, lossless PNG) and DST (compression-resistant).",
        "Document steganography via ZIP injection (Office/ODF) and append method (PDF, TXT, etc.).",
        "Video steganography using keyframe embedding.",
        "QR-based authentication with HMAC-signed tokens and rate limiting.",
        "Capacity estimation bar for image carriers.",
        "WhatsApp compression warning for image/video carriers.",
        "Minimalist dark portfolio-style responsive UI.",
        "Session-based access (24-hour default token lifetime).",
    ]:
        pdf.bullet(f)

    # 7 Steganography Methods
    pdf.add_page()
    pdf.section_title("7", "Steganography Methods")
    pdf.sub_title("7.1 Image - LSB (Least Significant Bit)")
    pdf.body(
        "LSB replaces the least significant bits of pixel color channels with encrypted payload bits. "
        "Works best on lossless PNG images. Fast and simple but destroyed by JPEG recompression "
        "or messaging app compression (e.g. WhatsApp)."
    )
    pdf.sub_title("7.2 Image - DST (Modified DCT)")
    pdf.body(
        "DST embeds data in the frequency domain using discrete cosine transform coefficients, "
        "making it more resistant to mild compression than LSB. Recommended when the carrier "
        "may undergo format conversion or light compression."
    )
    pdf.sub_title("7.3 Video Steganography")
    pdf.body(
        "Video carriers (MP4) embed encrypted data across selected video frames using image "
        "steganography techniques applied per frame, with configurable keyframe intervals."
    )
    pdf.sub_title("7.4 Document Steganography")
    pdf.body(
        "Office Open XML formats (DOCX, PPTX, XLSX, ODT, ODS, ODP) are ZIP archives. Payload is "
        "hidden inside a dedicated ZIP entry. PDF, RTF, TXT, CSV, MD, HTML, and XML use an "
        "append-based method with a magic header marker for extraction."
    )

    # 8 Encryption
    pdf.section_title("8", "Encryption and Security")
    pdf.body(
        "All payloads are encrypted before embedding. The system never stores user passwords. "
        "Wrong passwords fail decryption without revealing partial data."
    )
    pdf.table_row(["Component", "Implementation"], bold=True)
    pdf.table_row(["Algorithm", "AES-256-GCM (authenticated encryption)"])
    pdf.table_row(["Key derivation", "PBKDF2-HMAC-SHA256, 600,000 iterations"])
    pdf.table_row(["Salt", "16 random bytes per encryption"])
    pdf.table_row(["Nonce", "12 random bytes (GCM standard)"])
    pdf.table_row(["Session token", "HMAC-SHA256 signed JSON payload with expiry"])
    pdf.table_row(["Auth QR", "OPX1 signed format; verified with AUTH_SECRET"])
    pdf.table_row(["Rate limiting", "8 attempts per 15 minutes on auth endpoint"])

    # 9 Authentication
    pdf.section_title("9", "Authentication Flow")
    for step in [
        "User opens the landing page and reads disclaimer/policy.",
        "Administrator distributes auth QR code offline (not downloadable from UI).",
        "User uploads QR image; backend decodes and verifies HMAC signature.",
        "On success, a bearer session token is issued (default 24-hour TTL).",
        "Hide and Reveal API endpoints require Authorization: Bearer header.",
        "Expired or invalid tokens are rejected; user must re-authenticate.",
    ]:
        pdf.bullet(step)

    # 10 UI
    pdf.add_page()
    pdf.section_title("10", "User Interface")
    pdf.body(
        "The frontend uses a minimalist dark portfolio design with glassmorphism cards, "
        "purple/blue ambient gradients, animated logo, and cursor-following glow effects. "
        "The landing page includes hero, about, pipeline, formats, WhatsApp disclaimer, "
        "and access sections. Workspace pages (Hide/Reveal) use a step-by-step card layout."
    )
    pdf.sub_title("Pages")
    pdf.table_row(["Page", "Purpose"], bold=True)
    pdf.table_row(["Info / Landing", "Disclaimer, auth QR upload, platform overview"])
    pdf.table_row(["Hide", "3-step workflow: Carrier, Payload, Encrypt"])
    pdf.table_row(["Reveal", "Upload stego file, algorithm select, decrypt"])

    # 11 Supported Formats
    pdf.section_title("11", "Supported File Formats")
    pdf.sub_title("Carriers")
    pdf.body("Images: PNG, JPG, JPEG | Video: MP4 | Documents: PDF, DOCX, PPTX, XLSX, ODT, ODS, ODP, ODG, RTF, TXT, CSV, MD, HTML, XML")
    pdf.sub_title("Payloads")
    pdf.body("Text, documents, images (PNG/JPG), video (MP4), audio (MP3)")

    # 12 API
    pdf.section_title("12", "REST API Endpoints")
    pdf.table_row(["Method", "Path", "Auth", "Description"], bold=True)
    pdf.table_row(["POST", "/api/auth/verify", "No", "Verify auth QR, return token"])
    pdf.table_row(["POST", "/api/hide", "Yes", "Embed encrypted payload in carrier"])
    pdf.table_row(["POST", "/api/reveal", "Yes", "Extract and decrypt hidden payload"])
    pdf.table_row(["GET", "/api/health", "No", "Health check"])

    # 13 Installation
    pdf.section_title("13", "Installation and Execution")
    pdf.sub_title("Local Development")
    pdf.body(
        "Backend: cd pixelvault-backend, activate venv, pip install -r requirements.txt, "
        "uvicorn main:app --reload --port 8000\n"
        "Frontend: cd pixelvault-frontend, npm install, npm run dev\n"
        "Open http://localhost:5173"
    )
    pdf.sub_title("Production (Summary)")
    pdf.body(
        "Build frontend with VITE_API_URL=/api. Deploy static files to Cloudflare Pages. "
        "Deploy backend to Railway/Render with environment secrets. Point DNS opaquepixel.app "
        "to frontend and api.opaquepixel.app to backend. Enable HTTPS via platform SSL."
    )

    # 14 Testing
    pdf.section_title("14", "Testing")
    pdf.body(
        "Automated tests cover cryptography roundtrip, LSB/DST image stego, document stego, "
        "auth token validation, signed QR verification, and protected endpoint access. "
        "Run: pytest in pixelvault-backend directory."
    )

    # 15 Limitations
    pdf.section_title("15", "Limitations and Disclaimers")
    for item in [
        "WhatsApp and similar apps recompress photos/videos, destroying hidden data.",
        "LSB is not suitable for JPEG or compressed images.",
        "Large video files require significant processing time and memory.",
        "Platform is for educational, research, and lawful privacy use only.",
        "Users are responsible for compliance with local laws and policies.",
        "Auth QR must be kept private; compromise allows platform access.",
    ]:
        pdf.bullet(item)

    # 16 Future
    pdf.section_title("16", "Future Enhancements")
    for item in [
        "Audio steganography support expansion.",
        "Batch processing and API key management for researchers.",
        "Steganalysis detection dashboard for educational comparison.",
        "Mobile-responsive PWA with offline QR auth cache.",
        "Audit logging and admin panel for enterprise deployments.",
    ]:
        pdf.bullet(item)

    # 17 Conclusion
    pdf.section_title("17", "Conclusion")
    pdf.body(
        "Opaque Pixel demonstrates a complete, modern steganography platform combining encryption, "
        "multiple embedding techniques, secure authentication, and an accessible web interface. "
        "It serves as a practical tool for cybersecurity education, privacy research, and "
        "authorized testing while emphasizing lawful and responsible use."
    )

    # 18 PPT slide suggestions
    pdf.add_page()
    pdf.section_title("18", "Suggested PowerPoint Slide Outline")
    slides = [
        "Title Slide - Opaque Pixel: Advanced Steganography Platform",
        "Introduction and Problem Statement",
        "Objectives and Scope",
        "System Architecture Diagram",
        "Technology Stack",
        "Encryption: AES-256-GCM + PBKDF2",
        "Steganography Methods (LSB, DST, Video, Document)",
        "Authentication Flow (QR + Session Token)",
        "Hide Workflow Demo Screenshots",
        "Reveal Workflow Demo Screenshots",
        "Supported Formats Table",
        "UI Design Overview",
        "Security Features",
        "WhatsApp Compression Warning",
        "Testing and Validation",
        "Limitations and Ethical Use",
        "Future Work",
        "Conclusion and Q&A",
    ]
    for i, s in enumerate(slides, 1):
        pdf.bullet(f"Slide {i}: {s}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    return OUT


if __name__ == "__main__":
    path = build_pdf()
    print(f"PDF generated: {path}")
