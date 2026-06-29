import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthScanZone from "../components/AuthScanZone";
import GlassCard from "../components/GlassCard";
import WhatsAppCompressionNotice from "../components/WhatsAppCompressionNotice";
import Toast from "../components/Toast";
import SectionTag from "../components/ui/SectionTag";
import SectionHeading from "../components/ui/SectionHeading";
import Marquee from "../components/ui/Marquee";
import FormatOrbs from "../components/ui/FormatOrbs";
import { verifyAuthQr } from "../api/opaquepixel";
import { setAccessToken } from "../utils/auth";

const PIPELINE = [
  { n: "01", label: "Package", sub: "Metadata + compress" },
  { n: "02", label: "Encrypt", sub: "AES-256-GCM" },
  { n: "03", label: "Embed", sub: "Image · Video · Doc" },
  { n: "04", label: "Reveal", sub: "Password unlock" },
];

const HIGHLIGHTS = [
  { value: "+12", label: "File formats" },
  { value: "+4", label: "Pipeline steps" },
  { value: "256", label: "Bit encryption" },
];

const POLICY = [
  { ok: true, text: "Research, privacy, watermarking, authorized testing" },
  { ok: false, text: "Illegal content, malware, unauthorized bypass" },
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

  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!qrFile) {
      setToast({ message: "Upload your auth token", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const data = await verifyAuthQr(qrFile);
      setAccessToken(data.access_token);
      setToast({ message: "Welcome in", type: "success" });
      setTimeout(() => navigate("/hide"), 600);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setToast({
        message: typeof detail === "string" ? detail : "Verification failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack pb-12">
      {/* Hero */}
      <section id="hero" className="hero-block opacity-0 animate-fade-up">
        <div className="hero-glow" aria-hidden />
        <SectionTag>Steganography Platform</SectionTag>
        <h1 className="hero-title mt-8">
          Hi, I'm <span className="text-gradient">Opaque Pixel</span>
        </h1>
        <p className="hero-subtitle mt-4">Encryption · Steganography · Privacy</p>
        <p className="section-lead mt-6 mx-auto text-center max-w-xl">
          Hide secrets inside ordinary files — encrypted, invisible, and built for lawful
          privacy &amp; research.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <a href="#access" className="btn-primary">
            Get started
          </a>
          <a href="#about" className="btn-ghost">
            Learn more
          </a>
        </div>
      </section>

      {/* Developer Profile Banner */}
      <section className="opacity-0 animate-fade-up delay-1 max-w-3xl mx-auto w-full">
        <GlassCard className="border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-surface/80 to-teal-950/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Lead Developer &amp; Creator
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-3">
                Dharmik Suhagiya
              </h2>
              <p className="text-xs text-emerald-300 font-medium mt-0.5">
                Computer Science Engineering · IBM Cyber Security Project
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://github.com/dharmik281208"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost p-3"
                title="GitHub Profile"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/in/dhrmik-suhagiya-aab167315/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost p-3"
                title="LinkedIn Profile"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="mailto:dhrmiksuhagiya@gmail.com"
                className="btn-ghost p-3"
                title="Email Developer"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>
        </GlassCard>
      </section>

      <Marquee />

      {/* About */}
      <section id="about" className="opacity-0 animate-fade-up delay-2">
        <GlassCard hover={false} className="about-panel">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div>
              <SectionTag>About</SectionTag>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-6">
                Let's see that
              </h2>
              <p className="text-sm text-surface-dim leading-relaxed mt-5">
                Opaque Pixel is for educational, research, cybersecurity training, and lawful
                personal communication only. You accept full responsibility for your use.
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                {POLICY.map(({ ok, text }) => (
                  <li key={text} className="flex gap-3 text-surface-dim">
                    <span className={ok ? "text-accent-purple" : "text-accent-pink"}>
                      {ok ? "✓" : "✕"}
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {HIGHLIGHTS.map(({ value, label }) => (
                <div key={label} className="stat-chip">
                  <p className="stat-num text-3xl md:text-4xl">{value}</p>
                  <p className="text-xs text-surface-muted mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="section-block opacity-0 animate-fade-up delay-3">
        <SectionHeading
          tag="Pipeline"
          title="How it works"
          lead="Four steps from payload to hidden carrier and back."
          center
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {PIPELINE.map((step) => (
            <GlassCard key={step.n} className="group hover:scale-[1.02] cursor-default text-center md:text-left">
              <p className="stat-num group-hover:text-gradient transition-all">{step.n}</p>
              <p className="mt-4 text-sm font-medium text-white">{step.label}</p>
              <p className="text-xs text-surface-muted mt-2">{step.sub}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <WhatsAppCompressionNotice />

      {/* Formats */}
      <section id="formats" className="section-block opacity-0 animate-fade-up delay-4">
        <SectionHeading
          tag="Skills & Tools"
          title="Supported formats"
          lead="Carriers and payloads across documents, images, video, and audio."
          center
        />
        <div className="mt-10">
          <FormatOrbs />
        </div>
      </section>

      {/* Access / Contact */}
      <section id="access" className="section-block opacity-0 animate-fade-up delay-5">
        <SectionHeading
          tag="Contact"
          title="Let's talk"
          lead="Upload your authorized auth token to unlock Hide & Reveal."
          center
        />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="contact-card md:col-span-2">
            <h3 className="font-display text-lg font-semibold text-white">Get access</h3>
            <p className="text-xs text-surface-dim mt-2 leading-relaxed">
              Auth tokens are distributed offline by your administrator.
            </p>
            <form onSubmit={handleVerify} className="mt-6 space-y-5">
              <AuthScanZone file={qrFile} onFile={setQrFile} loading={loading} />
              <button type="submit" disabled={loading || !qrFile} className="btn-primary w-full">
                {loading ? "Verifying…" : "Enter platform →"}
              </button>
            </form>
          </div>
          <div className="space-y-5">
            <div className="contact-card">
              <h3 className="font-display text-sm font-semibold text-white">Hide</h3>
              <p className="text-xs text-surface-dim mt-2">Embed encrypted data in carriers.</p>
              <span className="contact-card-badge mt-4">After auth</span>
            </div>
            <div className="contact-card">
              <h3 className="font-display text-sm font-semibold text-white">Reveal</h3>
              <p className="text-xs text-surface-dim mt-2">Extract hidden payloads with password.</p>
              <span className="contact-card-badge mt-4">After auth</span>
            </div>
          </div>
        </div>
      </section>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
