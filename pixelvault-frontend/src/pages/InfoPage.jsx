import { Link } from "react-router-dom";
import { LsbPlayground, PipelineOrbit } from "../components/ui/StegoVisuals";

const marqueeItems = [
  "Steganography",
  "AES-256-GCM",
  "Image · Video · Doc",
  "Privacy Research",
  "Educational Use",
  "Lawful Only",
];

const pipeline = [
  { n: "01", title: "Package", desc: "Metadata + compress" },
  { n: "02", title: "Encrypt", desc: "AES-256-GCM" },
  { n: "03", title: "Embed", desc: "Image · Video · Doc" },
  { n: "04", title: "Reveal", desc: "Password unlock" },
];

export default function InfoPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 md:pt-24 pb-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, color-mix(in oklab, var(--lilac) 25%, transparent), transparent), radial-gradient(50% 40% at 85% 10%, color-mix(in oklab, var(--warm) 35%, transparent), transparent)",
          }}
        />
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div className="animate-float-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/70 px-3 py-1 text-xs text-[color:var(--slate)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--orchid)] animate-pulse" />
              Steganography Platform
            </div>
            <h1 className="mt-5 text-5xl md:text-7xl font-display font-semibold leading-[1.02] tracking-tight">
              Hi, I'm <span className="text-gradient">Opaque Pixel</span>
            </h1>
            <p className="mt-4 text-sm md:text-base font-medium text-[color:var(--orchid)]">
              Encryption · Steganography · Privacy
            </p>
            <p className="mt-5 max-w-xl text-[color:var(--slate)]">
              Hide secrets inside ordinary files — encrypted, invisible, and built for lawful
              privacy &amp; research.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hide"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-medium text-[color:var(--cream)] transition-all hover:bg-[color:var(--orchid)] hover:shadow-[var(--shadow-glow)]"
              >
                Get started →
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-all hover:border-[color:var(--orchid)] hover:-translate-y-0.5"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="relative animate-float-in">
            <div className="relative rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow-soft)]">
              <div className="text-xs uppercase tracking-widest text-[color:var(--dusk)]">
                Lead Developer &amp; Creator
              </div>
              <h3 className="mt-2 text-2xl font-display font-semibold text-[color:var(--ink)]">
                Dharmik Suhagiya
              </h3>
              <p className="mt-1 text-sm text-[color:var(--slate)]">
                Computer Science Engineering · IBM Cyber Security Project
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="https://github.com/dharmik281208" target="_blank" rel="noreferrer" className="rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]">GitHub</a>
                <a href="https://www.linkedin.com/in/dhrmik-suhagiya-aab167315/" target="_blank" rel="noreferrer" className="rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]">LinkedIn</a>
                <a href="mailto:dhrmiksuhagiya@gmail.com" className="rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]">Email</a>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: "+12", v: "File formats" },
                  { k: "+4", v: "Pipeline steps" },
                  { k: "256", v: "Bit encryption" },
                ].map((s) => (
                  <div key={s.v} className="rounded-2xl bg-[color:var(--muted)] p-3 text-center">
                    <div className="font-display text-xl text-[color:var(--ink)]">{s.k}</div>
                    <div className="text-[11px] text-[color:var(--slate)]">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-[color:var(--lilac)]/30 to-[color:var(--warm)]/30 blur-2xl" />
            <div className="mt-6">
              <LsbPlayground />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--cream)_60%,var(--lilac)_10%)] py-4 overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className="text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--slate)]">
              {t} <span className="text-[color:var(--orchid)]">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Live pipeline visual */}
      <section className="px-6 pt-16">
        <div className="mx-auto max-w-5xl">
          <PipelineOrbit />
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-[color:var(--orchid)]">About</div>
            <h2 className="mt-2 text-4xl font-display font-semibold text-[color:var(--ink)]">Let's see that</h2>
            <p className="mt-4 text-[color:var(--slate)]">
              Opaque Pixel is for educational, research, cybersecurity training, and lawful personal
              communication only. You accept full responsibility for your use.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-start gap-2 text-[color:var(--ink)]"><span className="text-[color:var(--orchid)]">✓</span> Research, privacy, watermarking, authorized testing</li>
              <li className="flex items-start gap-2 text-[color:var(--slate)]"><span className="text-[color:var(--destructive)]">✕</span> Illegal content, malware, unauthorized bypass</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { k: "+12", v: "File formats" },
              { k: "+4", v: "Pipeline steps" },
              { k: "256", v: "Bit encryption" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 text-center hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition">
                <div className="font-display text-3xl text-gradient">{s.k}</div>
                <div className="mt-1 text-xs text-[color:var(--slate)]">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-xs uppercase tracking-widest text-[color:var(--orchid)]">Pipeline</div>
          <h2 className="mt-2 text-4xl font-display font-semibold text-[color:var(--ink)]">How it works</h2>
          <p className="mt-2 text-[color:var(--slate)]">Four steps from payload to hidden carrier and back.</p>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {pipeline.map((p, i) => (
              <li key={p.n} className="relative">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 hover:border-[color:var(--orchid)] hover:-translate-y-1 transition-all">
                  <div className="font-display text-4xl text-[color:var(--dusk)]">{p.n}</div>
                  <div className="mt-2 text-lg font-display font-semibold text-[color:var(--ink)]">{p.title}</div>
                  <div className="text-sm text-[color:var(--slate)]">{p.desc}</div>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 h-px w-4 bg-gradient-to-r from-[color:var(--lilac)] to-transparent" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Warning */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[color:color-mix(in_oklab,var(--warm)_50%,transparent)] bg-[color:color-mix(in_oklab,var(--warm)_25%,transparent)] p-8">
          <div className="text-xs uppercase tracking-widest text-[color:var(--ink)]">Important</div>
          <h3 className="mt-2 text-2xl font-display font-semibold text-[color:var(--ink)]">
            WhatsApp photo &amp; video compression
          </h3>
          <p className="mt-3 text-[color:var(--slate)]">
            Media sent through WhatsApp is recompressed on delivery. Hidden data is usually
            destroyed in transit. Always share originals, not forwards.
          </p>
        </div>
      </section>
    </div>
  );
}
