import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function textToBits(text) {
  const bytes = new TextEncoder().encode(text);
  const bits = [];
  bytes.forEach((b) => {
    for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  });
  return bits;
}

function VisualFrame({ eyebrow, title, hint, children, footer }) {
  return (
    <figure className="rounded-3xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--card)_88%,transparent)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm">
      <figcaption className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--orchid)]">
            {eyebrow}
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-[color:var(--ink)]">
            {title}
          </div>
        </div>
        {hint ? <span className="text-[11px] text-[color:var(--dusk)]">{hint}</span> : null}
      </figcaption>
      {children}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </figure>
  );
}

/* 1. LSB Playground — home page hero visual */
export function LsbPlayground() {
  const canvasRef = useRef(null);
  const [bitDepth, setBitDepth] = useState(1);
  const [showPlane, setShowPlane] = useState(false);
  const [message, setMessage] = useState("opaque pixel");

  const bits = useMemo(() => textToBits(message || " "), [message]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 320;
    const H = 200;
    canvas.width = W;
    canvas.height = H;

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 0.01;
      const img = ctx.createImageData(W, H);
      const data = img.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (y * W + x) * 4;
          const wave = Math.sin(x * 0.02 + t) * 18 + Math.cos(y * 0.028 - t * 0.7) * 14;
          let r = 120 + (x / W) * 90 + wave;
          let g = 96 + (y / H) * 70 + wave * 0.6;
          let b = 160 + ((W - x) / W) * 70 - wave * 0.4;

          const bitIndex = (y * W + x) % bits.length;
          const payload = bits[bitIndex];
          const mask = (1 << bitDepth) - 1;
          r = (Math.max(0, Math.min(255, r)) & ~mask) | (payload ? mask : 0);
          g = (Math.max(0, Math.min(255, g)) & ~mask) | (payload ? mask : 0);
          b = (Math.max(0, Math.min(255, b)) & ~mask) | (payload ? mask : 0);

          if (showPlane) {
            const v = (r & mask) === mask ? 235 : 24;
            data[idx] = v;
            data[idx + 1] = v === 235 ? 190 : 30;
            data[idx + 2] = v === 235 ? 250 : 52;
          } else {
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
          }
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [bitDepth, showPlane, bits]);

  const capacity = Math.round((320 * 200 * 3 * bitDepth) / 8 / 1024);

  return (
    <VisualFrame eyebrow="Interactive" title="LSB playground" hint="Move the slider, flip the plane">
      <canvas
        ref={canvasRef}
        className="h-auto w-full rounded-2xl border border-[color:var(--border)]"
        style={{ imageRendering: "pixelated", aspectRatio: "320 / 200" }}
        aria-label="Live carrier image with an embedded least-significant-bit payload"
      />
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5">
          <span className="flex items-center justify-between text-[11px] text-[color:var(--slate)]">
            <span>Bits per channel</span>
            <span className="font-mono text-[color:var(--orchid)]">
              {bitDepth} · ~{capacity} KB capacity
            </span>
          </span>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={bitDepth}
            onChange={(e) => setBitDepth(Number(e.target.value))}
            className="w-full accent-[color:var(--orchid)] cursor-pointer"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] text-[color:var(--slate)]">Secret message</span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 48))}
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--orchid)]"
            placeholder="Type something to hide"
          />
        </label>
        <button
          type="button"
          onClick={() => setShowPlane((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--ink)] transition-all hover:border-[color:var(--orchid)] hover:-translate-y-0.5 cursor-pointer"
        >
          {showPlane ? "Show carrier" : "Reveal bit plane"}
        </button>
      </div>
    </VisualFrame>
  );
}

/* 2. Pixel embed grid — hide page */
export function PixelEmbedGrid({ seed = "hide" }) {
  const [phrase, setPhrase] = useState("secret");
  const bits = useMemo(() => textToBits(phrase || " "), [phrase]);
  const [tick, setTick] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const id = window.setInterval(() => setTick((v) => v + 1), 420);
    return () => window.clearInterval(id);
  }, []);

  const cells = 96;
  const values = useMemo(() => {
    return Array.from({ length: cells }, (_, i) => {
      const base = (i * 37 + seed.length * 13) % 256;
      const bit = bits[(i + tick) % bits.length];
      return { base: base & 0xfe, bit, byte: (base & 0xfe) | bit };
    });
  }, [bits, tick, seed]);

  return (
    <VisualFrame eyebrow="Embedding" title="Bit substitution grid" hint="Hover a pixel to inspect its byte">
      <div className="grid grid-cols-12 gap-1.5">
        {values.map((v, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            className="aspect-square rounded-[5px] transition-all duration-300 cursor-pointer"
            style={{
              background: v.bit
                ? "color-mix(in oklab, var(--orchid) 78%, transparent)"
                : "color-mix(in oklab, var(--lilac) 22%, transparent)",
              transform: hovered === i ? "scale(1.35)" : "scale(1)",
              boxShadow: v.bit && hovered === i ? "var(--shadow-glow)" : "none",
            }}
            aria-label={`Pixel ${i}, byte ${v.byte}`}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="grid gap-1.5">
          <span className="text-[11px] text-[color:var(--slate)]">Payload phrase</span>
          <input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value.slice(0, 32))}
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--orchid)]"
          />
        </label>
        <div className="rounded-xl bg-[color:var(--muted)] px-3 py-2 font-mono text-xs text-[color:var(--slate)]">
          {hovered === null
            ? `${bits.length} bits queued`
            : `0b${values[hovered].byte.toString(2).padStart(8, "0")} · lsb=${values[hovered].bit}`}
        </div>
      </div>
    </VisualFrame>
  );
}

/* 3. Reveal scope — reveal page */
export function RevealScope() {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const glyphs = useMemo(
    () =>
      Array.from({ length: 240 }, (_, i) =>
        (i * 61) % 7 === 0 ? "1" : (i * 29) % 5 === 0 ? "0" : (i * 17) % 3 === 0 ? "1" : "0",
      ),
    [],
  );

  const onMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <VisualFrame eyebrow="Extraction" title="Decode scope" hint="Move your cursor across the carrier">
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        className="relative h-56 overflow-hidden rounded-2xl border border-[color:var(--border)] cursor-crosshair"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--lilac) 30%, var(--card)), color-mix(in oklab, var(--warm) 30%, var(--card)))",
        }}
      >
        <div
          className="absolute inset-0 grid font-mono text-[10px] leading-none text-[color:var(--ink)] transition-opacity duration-300"
          style={{
            gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
            opacity: active ? 1 : 0,
            padding: "10px",
            maskImage: `radial-gradient(90px 90px at ${pos.x}% ${pos.y}%, black 30%, transparent 72%)`,
            WebkitMaskImage: `radial-gradient(90px 90px at ${pos.x}% ${pos.y}%, black 30%, transparent 72%)`,
          }}
          aria-hidden
        >
          {glyphs.map((g, i) => (
            <span key={i} className="flex items-center justify-center py-[3px] opacity-80">
              {g}
            </span>
          ))}
        </div>
        <div
          className="pointer-events-none absolute h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--orchid)] transition-opacity duration-200"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity: active ? 0.8 : 0,
            boxShadow: "var(--shadow-glow)",
          }}
        />
        {!active ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[color:var(--slate)]">
            Hover to sweep the decode scope over the carrier
          </div>
        ) : null}
      </div>
    </VisualFrame>
  );
}

/* 4. Scan heatmap — scan page */
export function ScanHeatmap() {
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const cells = 160;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.012));
    }, 40);
    return () => window.clearInterval(id);
  }, [running]);

  const anomalies = useMemo(
    () => new Set(Array.from({ length: 18 }, (_, i) => (i * 17 + 23) % cells)),
    [],
  );

  return (
    <VisualFrame
      eyebrow="Forensics"
      title="Anomaly sweep"
      hint={`${Math.round(progress * 100)}% analysed`}
      footer={
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--ink)] transition-all hover:border-[color:var(--orchid)] cursor-pointer"
        >
          {running ? "Pause sweep" : "Resume sweep"}
        </button>
      }
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
        {Array.from({ length: cells }, (_, i) => {
          const scanned = i / cells <= progress;
          const flagged = scanned && anomalies.has(i);
          return (
            <div
              key={i}
              className="aspect-square rounded-[4px] transition-all duration-300"
              style={{
                background: flagged
                  ? "color-mix(in oklab, var(--destructive) 70%, transparent)"
                  : scanned
                    ? "color-mix(in oklab, var(--orchid) 45%, transparent)"
                    : "color-mix(in oklab, var(--border) 60%, transparent)",
                transform: flagged ? "scale(1.15)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-[color:var(--slate)]">
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-[2px] bg-[color:color-mix(in_oklab,var(--orchid)_45%,transparent)] inline-block" />
          Clean blocks
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-[2px] bg-[color:color-mix(in_oklab,var(--destructive)_70%,transparent)] inline-block" />
          Statistical anomaly
        </span>
      </div>
    </VisualFrame>
  );
}

/* 5. Pipeline orbit — how it works */
const PIPELINE = [
  { key: "package", label: "Package", detail: "Metadata header + Zlib compression" },
  { key: "encrypt", label: "Encrypt", detail: "AES-256-GCM · PBKDF2 600k" },
  { key: "embed", label: "Embed", detail: "LSB / DCT / F5 / PVD substitution" },
  { key: "reveal", label: "Reveal", detail: "Password unlock + integrity tag" },
];

export function PipelineOrbit() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % PIPELINE.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <VisualFrame eyebrow="Pipeline" title="Payload → carrier" hint="Click a stage">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex gap-2 sm:flex-col">
          {PIPELINE.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setStep(i)}
              className="flex-1 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all sm:flex-none cursor-pointer"
              style={{
                background:
                  step === i
                    ? "color-mix(in oklab, var(--orchid) 82%, transparent)"
                    : "color-mix(in oklab, var(--muted) 90%, transparent)",
                color: step === i ? "var(--cream)" : "var(--slate)",
              }}
            >
              {String(i + 1).padStart(2, "0")} · {p.label}
            </button>
          ))}
        </div>

        <div className="relative h-48 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)]">
          <div className="grid h-full gap-[3px] p-3" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
            {Array.from({ length: 24 * 8 }, (_, i) => {
              const col = i % 24;
              const reach = ((step + 1) / PIPELINE.length) * 24;
              const on = col < reach;
              return (
                <div
                  key={i}
                  className="rounded-[3px] transition-all duration-500"
                  style={{
                    background: on
                      ? `color-mix(in oklab, var(--orchid) ${25 + ((i * 13) % 60)}%, transparent)`
                      : "color-mix(in oklab, var(--border) 70%, transparent)",
                    transitionDelay: `${col * 12}ms`,
                  }}
                />
              );
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-[color:color-mix(in_oklab,var(--card)_92%,transparent)] px-4 py-3 backdrop-blur-sm">
            <div className="font-display text-sm font-semibold text-[color:var(--ink)]">
              {PIPELINE[step].label}
            </div>
            <div className="text-[11px] text-[color:var(--slate)]">{PIPELINE[step].detail}</div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* 6. Interactive Cipher signature with Eye toggle & copy button — contact page */
const CIPHER_CHARS = "01#%&*<>/\\{}[]?$@";

export function CipherSignature({ text = "dhrmiksuhagiya@gmail.com" }) {
  const [display, setDisplay] = useState(text);
  const [revealed, setRevealed] = useState(0);
  const [revealMode, setRevealMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (revealMode) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const id = window.setInterval(() => {
      frame++;
      const r = Math.min(text.length, Math.floor(frame / 2));
      setRevealed(r);
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            i < r || ch === " " || ch === "@" || ch === "."
              ? ch
              : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)],
          )
          .join(""),
      );
      if (r >= text.length) {
        frame = -30;
      }
    }, 55);
    return () => window.clearInterval(id);
  }, [text, revealMode]);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <VisualFrame
      eyebrow="Cipher"
      title="Decrypting channel"
      hint={revealMode ? "Email Unlocked" : "Click Eye to reveal full email"}
    >
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {revealMode ? (
            <a
              href={`mailto:${text}`}
              className="font-mono text-base md:text-lg font-bold tracking-tight text-[color:var(--orchid)] hover:underline break-all"
            >
              {text}
            </a>
          ) : (
            <div className="font-mono text-lg tracking-tight text-[color:var(--ink)] break-all">
              {display}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRevealMode((prev) => !prev)}
              aria-label={revealMode ? "Hide cipher" : "Reveal full email"}
              title={revealMode ? "Hide cipher" : "Reveal full email"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:border-[color:var(--orchid)] transition-all cursor-pointer shadow-sm"
            >
              {revealMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-[color:var(--orchid)]" />
                  <span>Cipher</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[color:var(--orchid)]" />
                  <span>Reveal</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:border-[color:var(--orchid)] transition-all cursor-pointer shadow-sm"
            >
              {copied ? "Copied! ✓" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[color:var(--border)]">
          <div
            className="h-full rounded-full bg-[color:var(--orchid)] transition-all duration-100"
            style={{ width: revealMode ? "100%" : `${(revealed / text.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--slate)]">
          <span>{revealMode ? "Decrypted Plaintext Stream" : "AES-256-GCM cipher stream"}</span>
          <span className="text-emerald-500 font-semibold flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            {revealMode ? "Unlocked" : "Live Scramble"}
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}
