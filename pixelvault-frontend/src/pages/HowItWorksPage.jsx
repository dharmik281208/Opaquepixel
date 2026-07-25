import { PipelineOrbit, LsbPlayground } from "../components/ui/StegoVisuals";

const steps = [
  {
    n: "01",
    title: "Cryptographic packaging",
    sub: "AES-256-GCM + PBKDF2",
    body: "Payload files are packaged with metadata headers, compressed with Zlib, and encrypted using AES-256-GCM authenticated encryption derived via 600,000 iterations of PBKDF2.",
  },
  {
    n: "02",
    title: "Spatial LSB embedding",
    sub: "Multi-bit vectorized LSB",
    body: "LSB steganography alters the least significant bits of subpixel RGB channels. A vectorized NumPy engine performs zero-copy bit substitutions for maximum capacity while remaining imperceptible.",
  },
  {
    n: "03",
    title: "Frequency DCT/DST transformation",
    sub: "High-capacity frequency blocks",
    body: "Partitions the Y luminance channel into 8×8 blocks, applies Discrete Cosine Transforms, and quantizes 16 mid-frequency AC coefficients per block — a 1600% capacity boost resilient to compression.",
  },
  {
    n: "04",
    title: "Matrix steganography probe",
    sub: "Syndrome matrix encoding",
    body: "Evaluates parity matrices over subpixel groups, modifying fewer bits while hiding equivalent data volumes for elevated security analysis and deep media scanning.",
  },
  {
    n: "05",
    title: "F5 steganography",
    sub: "F5 matrix DCT embedding",
    body: "F5 combines matrix encoding with DCT coefficient modification, producing statistically undetectable payloads that survive many compression pipelines.",
  },
  {
    n: "06",
    title: "PVD & spatial",
    sub: "Pixel differencing & direct domain",
    body: "Pixel value differencing adapts embedding density to local image texture, while spatial-domain modes provide the fastest lossless path for PNG carriers.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--orchid)]">
          IBM Cyber Security Internship · Final Project
        </div>
        <h1 className="mt-3 text-5xl md:text-6xl font-display font-semibold text-[color:var(--ink)]">
          Opaque<span className="text-[color:var(--orchid)]">Pixel</span> Platform
        </h1>
        <p className="mt-3 text-[color:var(--slate)]">
          Advanced multi-carrier steganography &amp; encryption engine.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[color:var(--orchid)] to-[color:var(--warm)] flex items-center justify-center font-display font-bold text-white text-sm">
            D
          </div>
          <div>
            <div className="text-sm font-semibold text-[color:var(--ink)]">Dharmik Suhagiya</div>
            <div className="text-xs text-[color:var(--slate)]">Lead Engineer · Computer Science Engineering</div>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-xs uppercase tracking-widest text-[color:var(--orchid)]">Architecture</div>
          <h2 className="mt-2 text-4xl font-display font-semibold text-[color:var(--ink)]">How it works</h2>
          <p className="mt-2 max-w-3xl text-[color:var(--slate)]">
            Explore the cryptographic packaging, frequency-domain transformations, and spatial
            steganography algorithms that power Opaque Pixel.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PipelineOrbit />
          <LsbPlayground />
        </div>

        <ol className="mt-12 relative border-l border-[color:var(--border)] pl-8 space-y-8">
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <span className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--cream)] text-xs font-semibold font-display">
                {s.n}
              </span>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 hover:border-[color:var(--orchid)] transition-colors">
                <div className="text-xs uppercase tracking-widest text-[color:var(--dusk)]">{s.title}</div>
                <h3 className="mt-1 text-xl font-display font-semibold text-[color:var(--ink)]">{s.sub}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--slate)]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
