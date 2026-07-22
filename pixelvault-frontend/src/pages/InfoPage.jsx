import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";

/* ─── Data ─── */
const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "AES-256-GCM Encryption",
    desc: "Military-grade encryption ensures your hidden data stays truly private. Every payload is encrypted before embedding.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: "Multi-Format Support",
    desc: "Hide data inside images, video, audio, and documents. 12+ file formats supported as carriers and payloads.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Zero Server Storage",
    desc: "All processing happens in your browser. No files are uploaded or stored on any server. Complete privacy.",
  },
];

const PIPELINE = [
  { num: "01", title: "Upload", desc: "Select your carrier file and the secret payload to embed" },
  { num: "02", title: "Encrypt", desc: "AES-256-GCM encryption secures your data with a password" },
  { num: "03", title: "Embed", desc: "Steganographic algorithms hide data inside the carrier" },
  { num: "04", title: "Share", desc: "Download the carrier — it looks identical to the original" },
];

const FORMAT_CATEGORIES = {
  Images: [
    { id: "PNG", tone: "purple" },
    { id: "JPG", tone: "pink" },
    { id: "BMP", tone: "blue" },
    { id: "WEBP", tone: "purple" },
  ],
  Video: [
    { id: "MP4", tone: "pink" },
    { id: "AVI", tone: "blue" },
    { id: "MKV", tone: "purple" },
  ],
  Audio: [
    { id: "MP3", tone: "blue" },
    { id: "WAV", tone: "purple" },
    { id: "FLAC", tone: "pink" },
    { id: "OGG", tone: "blue" },
    { id: "M4A", tone: "purple" },
  ],
  Documents: [
    { id: "PDF", tone: "pink" },
    { id: "DOCX", tone: "blue" },
    { id: "PPTX", tone: "purple" },
    { id: "XLSX", tone: "pink" },
    { id: "TXT", tone: "blue" },
  ],
};

const STATS = [
  { value: "12+", label: "File Formats" },
  { value: "256", label: "Bit Encryption" },
  { value: "4", label: "Pipeline Steps" },
  { value: "0", label: "Files Stored" },
];

/* ─── Intersection Observer hook ─── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ─── Animated Counter ─── */
function AnimatedStat({ value, label }) {
  const [ref, visible] = useInView();
  const [display, setDisplay] = useState("0");
  const numericPart = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const dur = 1200;
    const step = Math.ceil(numericPart / (dur / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numericPart) { start = numericPart; clearInterval(timer); }
      setDisplay(String(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, numericPart]);

  return (
    <div ref={ref} className="landing-stat">
      <p className="landing-stat-value">{display}{suffix}</p>
      <p className="landing-stat-label">{label}</p>
    </div>
  );
}

/* ─── Sparkle Particles ─── */
function Sparkles({ count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <span
      key={i}
      className="landing-sparkle"
      style={{
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${3 + Math.random() * 3}s`,
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
      }}
    />
  ));
}

/* ─── Main Page ─── */
export default function InfoPage() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("Images");

  const [featRef, featVisible] = useInView();
  const [pipeRef, pipeVisible] = useInView();
  const [fmtRef, fmtVisible] = useInView();
  const [devRef, devVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

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
    <div className="flex flex-col">
      {/* ═══════ HERO ═══════ */}
      <section id="hero" className="landing-hero">
        {/* Glow orbs */}
        <div className="landing-orb landing-orb-1" aria-hidden />
        <div className="landing-orb landing-orb-2" aria-hidden />
        <div className="landing-orb landing-orb-3" aria-hidden />

        <div className="landing-hero-content opacity-0 animate-fade-up">
          <span className="landing-badge">
            <span className="landing-badge-dot" aria-hidden />
            Steganography Platform
          </span>

          <h1 className="landing-hero-title mt-4">
            Hide Secrets{" "}
            <span className="text-gradient-warm">in Plain Sight</span>
          </h1>

          <p className="landing-hero-desc">
            Encrypt and embed confidential data inside ordinary files — images, video,
            audio, and documents. Invisible, secure, and built for lawful privacy &amp; research.
          </p>

          <div className="landing-hero-buttons">
            <Link to="/hide" className="landing-btn-glow">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                Start Hiding
              </span>
            </Link>
            <a href="#features" className="landing-btn-outline">
              Learn More ↓
            </a>
          </div>

          {/* Stats */}
          <div className="landing-stats">
            {STATS.map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="landing-scroll-indicator" aria-hidden>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section
        id="features"
        ref={featRef}
        className="landing-section"
        style={{
          opacity: featVisible ? 1 : 0,
          transform: featVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="landing-section-header">
          <span className="landing-badge">
            <span className="landing-badge-dot" aria-hidden />
            Core Features
          </span>
          <h2 className="landing-section-title">
            What Makes Opaque Pixel <span className="text-gradient-warm">Unique</span>
          </h2>
          <p className="landing-section-desc">
            Built for researchers, cybersecurity professionals, and privacy-conscious users
            who need robust steganographic capabilities.
          </p>
        </div>

        <div className="landing-features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="landing-feature-card"
              style={{
                opacity: featVisible ? 1 : 0,
                transform: featVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
              }}
            >
              <div className="landing-feature-icon text-purple-400">
                {f.icon}
              </div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ PIPELINE ═══════ */}
      <section
        id="pipeline"
        ref={pipeRef}
        className="landing-section"
        style={{
          opacity: pipeVisible ? 1 : 0,
          transform: pipeVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="landing-section-header">
          <span className="landing-badge">
            <span className="landing-badge-dot" aria-hidden />
            Pipeline
          </span>
          <h2 className="landing-section-title">
            How It <span className="text-gradient-warm">Works</span>
          </h2>
          <p className="landing-section-desc">
            Four simple steps from your secret payload to an invisible hidden carrier.
          </p>
        </div>

        <div className="landing-timeline">
          <div className="landing-timeline-grid">
            <div className="landing-timeline-connector" aria-hidden />
            {PIPELINE.map((step, i) => (
              <div
                key={step.num}
                className="landing-timeline-step"
                style={{
                  opacity: pipeVisible ? 1 : 0,
                  transform: pipeVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                }}
              >
                <div className="landing-timeline-number">{step.num}</div>
                <h3 className="landing-timeline-title">{step.title}</h3>
                <p className="landing-timeline-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FORMATS ═══════ */}
      <section
        id="formats"
        ref={fmtRef}
        className="landing-section"
        style={{
          opacity: fmtVisible ? 1 : 0,
          transform: fmtVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="landing-section-header">
          <span className="landing-badge">
            <span className="landing-badge-dot" aria-hidden />
            Supported Formats
          </span>
          <h2 className="landing-section-title">
            Carriers &amp; <span className="text-gradient-warm">Payloads</span>
          </h2>
          <p className="landing-section-desc">
            Embed data across a wide range of file types — from documents to multimedia.
          </p>
        </div>

        <div className="landing-formats-container">
          {/* Tabs */}
          <div className="landing-format-tabs">
            {Object.keys(FORMAT_CATEGORIES).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`landing-format-tab ${activeCategory === cat ? "landing-format-tab-active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Format badges */}
          <div className="landing-format-grid">
            {FORMAT_CATEGORIES[activeCategory].map((fmt, i) => (
              <div
                key={fmt.id}
                className={`landing-format-badge landing-format-badge-${fmt.tone}`}
                style={{
                  opacity: fmtVisible ? 1 : 0,
                  transform: fmtVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
                  transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
                }}
                title={fmt.id}
              >
                {fmt.id}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DEVELOPER ═══════ */}
      <section
        id="about"
        ref={devRef}
        className="landing-section"
        style={{
          opacity: devVisible ? 1 : 0,
          transform: devVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="landing-section-header">
          <span className="landing-badge">
            <span className="landing-badge-dot" aria-hidden />
            Creator
          </span>
          <h2 className="landing-section-title">
            Meet the <span className="text-gradient-warm">Developer</span>
          </h2>
        </div>

        <div className="landing-dev-card">
          <div className="landing-dev-card-border-glow" aria-hidden />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            {/* Avatar placeholder with initials */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 font-display text-2xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.35)",
              }}
            >
              DS
            </div>

            <div className="flex-1">
              <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 mb-3">
                Lead Developer &amp; Creator
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Dharmik Suhagiya
              </h3>
              <p className="text-sm text-surface-dim mt-1">
                Computer Science Engineering · IBM Cyber Security Project
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://github.com/dharmik281208"
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn-outline !px-3.5 !py-3"
                title="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/in/dhrmik-suhagiya-aab167315/"
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn-outline !px-3.5 !py-3"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="mailto:dhrmiksuhagiya@gmail.com"
                className="landing-btn-outline !px-3.5 !py-3"
                title="Email"
              >
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section
        id="access"
        ref={ctaRef}
        className="landing-section pb-16"
        style={{
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <div className="landing-cta">
          <Sparkles count={12} />
          <h2 className="landing-cta-title">
            Ready to <span className="text-gradient-warm">Get Started?</span>
          </h2>
          <p className="landing-cta-desc">
            Access steganography tools directly — no account needed. Hide data, reveal secrets, or scan files for hidden payloads.
          </p>
          <div className="landing-cta-buttons">
            <Link to="/hide" className="landing-btn-glow">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                Hide Data
              </span>
            </Link>
            <Link to="/reveal" className="landing-btn-outline">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Reveal Secret
              </span>
            </Link>
            <Link to="/scan" className="landing-btn-outline">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Scan &amp; Inspect
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
