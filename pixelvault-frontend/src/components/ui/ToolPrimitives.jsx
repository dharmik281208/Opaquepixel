import { useState } from "react";

export function SectionHeader({ step, title, kicker }) {
  return (
    <div className="mb-6">
      {step && (
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--orchid)]">
          {step}
        </div>
      )}
      <h2 className="mt-1 text-2xl md:text-3xl font-display font-semibold text-[color:var(--ink)]">
        {title}
      </h2>
      {kicker && <p className="mt-2 text-sm text-[color:var(--slate)]">{kicker}</p>}
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 md:p-8 shadow-[0_10px_40px_-24px_rgba(34,34,59,0.15)] animate-float-in ${className}`}
    >
      {children}
    </section>
  );
}

export function Chip({ children, tone = "default" }) {
  const tones = {
    default: "bg-[color:var(--muted)] text-[color:var(--slate)]",
    accent: "bg-[color:color-mix(in_oklab,var(--lilac)_20%,transparent)] text-[color:var(--ink)]",
    warn: "bg-[color:color-mix(in_oklab,var(--warm)_45%,transparent)] text-[color:var(--ink)]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function OptionGroup({ label, value, onChange, options }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)] mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`group rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all cursor-pointer ${
                active
                  ? "border-[color:var(--orchid)] bg-[color:color-mix(in_oklab,var(--lilac)_18%,transparent)] shadow-[var(--shadow-soft)]"
                  : "border-[color:var(--border)] bg-[color:var(--card)] hover:border-[color:var(--lilac)] hover:-translate-y-0.5"
              }`}
            >
              <div className="font-medium text-[color:var(--ink)]">{o.label}</div>
              {o.hint && (
                <div className="text-[11px] text-[color:var(--slate)]">{o.hint}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PasswordField({ label = "Password", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)]">
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="w-full rounded-xl border border-[color:var(--input)] bg-[color:var(--card)] px-4 py-3 pr-16 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--orchid)] focus:ring-4 focus:ring-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-medium text-[color:var(--slate)] hover:bg-[color:var(--muted)] cursor-pointer"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--ink)] px-6 py-3.5 text-sm font-medium text-[color:var(--cream)] transition-all hover:bg-[color:var(--orchid)] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-50 cursor-pointer ${props.className ?? ""}`}
    >
      {children}
      <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
    </button>
  );
}

export function WhatsAppWarning() {
  return (
    <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--warm)_50%,transparent)] bg-[color:color-mix(in_oklab,var(--warm)_25%,transparent)] p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)]">
        WhatsApp compression warning
      </div>
      <p className="mt-1.5 text-sm text-[color:var(--slate)]">
        Photos and videos sent through WhatsApp are recompressed. Hidden data is usually destroyed.
        Use the original file — not a WhatsApp download or forward.
      </p>
    </div>
  );
}

export const CARRIERS = [
  { value: "image", label: "Image", hint: "PNG · JPG" },
  { value: "video", label: "Video", hint: "MP4" },
  { value: "audio", label: "Audio", hint: "MP3 · WAV · FLAC" },
  { value: "doc", label: "Document", hint: "PDF · Office · ODF" },
];

export const ALGORITHMS = [
  { value: "auto", label: "Auto", hint: "Recommended · Smart" },
  { value: "dst", label: "DST", hint: "Compression resistant" },
  { value: "lsb", label: "LSB", hint: "Fast · lossless PNG" },
  { value: "matrix", label: "Matrix", hint: "High security · robust" },
  { value: "f5", label: "F5", hint: "Matrix DCT encoding" },
  { value: "pvd", label: "PVD", hint: "Pixel differencing" },
  { value: "spatial", label: "Spatial", hint: "Direct spatial domain" },
];
