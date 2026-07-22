import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";

// Images generated for the Bootstrap Security theme
import imgStego from "../assets/graphics/bs_stego.png";
import imgCrypto from "../assets/graphics/bs_crypto.png";
import imgPrivacy from "../assets/graphics/bs_privacy.png";

const PIPELINE_STEPS = [
  {
    num: "1",
    title: "Upload & Select",
    desc: "Choose an innocent-looking carrier file (image, video, document) and the secret payload you wish to hide."
  },
  {
    num: "2",
    title: "Military-Grade Encryption",
    desc: "Your payload is encrypted client-side using military-grade AES-256-GCM. We never see your data or password."
  },
  {
    num: "3",
    title: "Steganographic Embed",
    desc: "Our algorithms weave the encrypted bytes directly into the carrier's structure, completely invisible to the eye."
  },
  {
    num: "4",
    title: "Secure Share",
    desc: "Download the modified carrier. Share it publicly. Only someone with your exact password can extract the secret."
  }
];

const FEATURES = [
  {
    title: "Steganography Core",
    desc: "Embed secrets seamlessly into ordinary files without detection.",
    img: imgStego,
  },
  {
    title: "AES-256 Encryption",
    desc: "Cryptographically secure your payloads before hiding them.",
    img: imgCrypto,
  },
  {
    title: "Zero Server Storage",
    desc: "100% browser-side processing. Your data never leaves your device.",
    img: imgPrivacy,
  }
];

export default function InfoPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    const id = location.hash.replace("#", "");
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [location.pathname, location.hash]);

  return (
    <div className="bs-body bg-white min-h-screen font-sans text-gray-800">
      
      {/* ═══════ JUMBOTRON HERO ═══════ */}
      <section id="hero" className="bs-jumbotron text-center">
        <div className="bs-container">
          <span className="bs-badge bs-bg-primary mb-3 text-sm px-3 py-2 shadow-sm">
            Professional Steganography Platform
          </span>
          <h1 className="bs-display-5 fw-bold text-gray-900 mb-4">
            Invisible Security for <br className="hidden md:block"/> the Modern Web.
          </h1>
          <p className="bs-lead text-gray-500 mb-5 max-w-2xl mx-auto">
            Opaque Pixel combines cryptographic strength with advanced steganography.
            Hide your most sensitive payloads in plain sight, fully within your browser.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/hide" className="bs-btn bs-btn-primary bs-btn-lg shadow-sm">
              Launch Application
            </Link>
            <a href="#pipeline" className="bs-btn bs-btn-outline-secondary bs-btn-lg">
              Explore Technology
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES GRID (CARDS) ═══════ */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="bs-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">Enterprise-Grade Arsenal</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Built from the ground up to provide uncompromised digital stealth and reliability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="bs-card h-full transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                <img src={feat.img} alt={feat.title} className="w-full h-48 object-cover rounded-t bg-gray-100" />
                <div className="bs-card-body">
                  <h3 className="bs-card-title text-gray-800">{feat.title}</h3>
                  <p className="bs-card-text">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PIPELINE (LIST GROUP / TIMELINE) ═══════ */}
      <section id="pipeline" className="py-16 bg-white border-t border-gray-200">
        <div className="bs-container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">How It Operates</h2>
            <p className="text-gray-500">Our processing pipeline ensures maximum security without compromising file integrity.</p>
          </div>
          
          <div className="space-y-6">
            {PIPELINE_STEPS.map((step) => (
              <div key={step.num} className="bs-card flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#0d6efd] text-white flex items-center justify-center p-6 md:w-32 rounded-t md:rounded-l md:rounded-tr-none">
                  <span className="text-4xl font-bold opacity-80">{step.num}</span>
                </div>
                <div className="bs-card-body p-6 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SUPPORTED FORMATS (PILLS) ═══════ */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="bs-container text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Supported Carrier Formats</h2>
          <p className="text-gray-500 mb-8">Embed payloads into practically any medium. We support a vast array of file types.</p>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {['PNG', 'JPG', 'BMP', 'WEBP', 'MP4', 'AVI', 'MKV', 'MP3', 'WAV', 'FLAC', 'PDF', 'DOCX', 'TXT'].map(format => (
              <span key={format} className="bs-badge bs-bg-secondary text-sm px-4 py-2 shadow-sm hover:bs-bg-primary transition-colors cursor-default">
                {format}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-10 text-center bg-white border-t border-gray-200">
        <div className="bs-container">
          <p className="text-gray-500 mb-1">© {new Date().getFullYear()} Opaque Pixel. Built for lawful use.</p>
          <p className="text-sm text-gray-400">Dharmik Suhagiya · Computer Science Engineering</p>
        </div>
      </footer>
      
    </div>
  );
}
