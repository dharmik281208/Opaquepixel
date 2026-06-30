from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from config import ALLOWED_ORIGINS
from routers import auth, hide, reveal, scan

app = FastAPI(title="Opaque Pixel API", version="1.0.0", description="Steganography Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(hide.router, prefix="/api")
app.include_router(reveal.router, prefix="/api")
app.include_router(scan.router, prefix="/api")


@app.get("/")
def root():
    return RedirectResponse(url="/docs")


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0", "service": "Opaque Pixel"}
