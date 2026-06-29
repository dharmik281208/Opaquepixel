import GlassCard from "../components/GlassCard";
import SectionTag from "../components/ui/SectionTag";
import SectionHeading from "../components/ui/SectionHeading";

export default function HowItWorksPage() {
  return (
    <div className="page-stack max-w-4xl mx-auto w-full pb-16">
      {/* Project Banner & Credits */}
      <section className="opacity-0 animate-fade-up">
        <GlassCard className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-surface/90 to-teal-950/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                IBM Cyber Security Internship Final Project
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-4 tracking-tight drop-shadow-sm">
                OpaquePixel Platform
              </h1>
              <p className="text-sm font-medium text-emerald-200/90 mt-2 leading-relaxed">
                Advanced Multi-Carrier Steganography &amp; Encryption Engine
              </p>
            </div>
            <div className="bg-emerald-950/50 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 text-center md:text-right shrink-0 min-w-[230px] shadow-lg">
              <p className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-widest">Lead Engineer</p>
              <p className="font-display text-lg font-bold text-white mt-1 drop-shadow-sm">Dharmik Suhagiya</p>
              <p className="text-xs font-semibold text-emerald-300 mt-0.5">Computer Science Engineering</p>
              <div className="flex items-center justify-center md:justify-end gap-3 mt-3 pt-3 border-t border-emerald-500/20">
                <a href="https://github.com/dharmik281208" target="_blank" rel="noopener noreferrer" className="text-emerald-300/80 hover:text-white hover:scale-110 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/dhrmik-suhagiya-aab167315/" target="_blank" rel="noopener noreferrer" className="text-emerald-300/80 hover:text-white hover:scale-110 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="mailto:dhrmiksuhagiya@gmail.com" className="text-emerald-300/80 hover:text-white hover:scale-110 transition-all">
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* How It Works Heading */}
      <section className="mt-8 opacity-0 animate-fade-up delay-1">
        <SectionHeading
          tag="Architecture"
          title="How It Works"
          lead="Explore the inner workings of our cryptographic packaging, frequency-domain transformations, and spatial steganography algorithms."
          center
        />
      </section>

      {/* Core Principles Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-8 opacity-0 animate-fade-up delay-2">
        <GlassCard>
          <SectionTag>01. Cryptographic Packaging</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">AES-256-GCM + PBKDF2</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            Before embedding, raw payload files (text, images, audio, video, or documents) are packaged with metadata headers, compressed using Zlib, and encrypted using AES-256-GCM authenticated encryption derived via 600,000 iterations of PBKDF2.
          </p>
        </GlassCard>

        <GlassCard>
          <SectionTag>02. Spatial LSB Embedding</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">Multi-Bit Vectorized LSB</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            LSB steganography alters the least significant bits of subpixel color channels (RGB). Our high-performance NumPy vectorized engine performs zero-copy bit substitutions, providing maximum payload capacity while remaining imperceptible.
          </p>
        </GlassCard>

        <GlassCard>
          <SectionTag>03. Frequency DCT/DST Transformation</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">High-Capacity Frequency Blocks</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            DST/DCT frequency steganography partitions the Y luminance channel into 8x8 blocks, applies Discrete Cosine Transforms, and quantizes 16 mid-frequency AC coefficients per block, yielding a 1600% capacity boost resilient to compression.
          </p>
        </GlassCard>

        <GlassCard>
          <SectionTag>04. Matrix Steganography Probe</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">Syndrome Matrix Encoding</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            Matrix steganography evaluates parity matrices over subpixel groups, modifying fewer bits while hiding equivalent data volumes for elevated security analysis and deep media scanning.
          </p>
        </GlassCard>

        <GlassCard>
          <SectionTag>05. F5 Steganography Algorithm</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">F5 Matrix DCT Embedding</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            F5 steganography permutes DCT AC coefficients across spatial frequency blocks, utilizing matrix encoding to minimize modified coefficients and defeat chi-square statistical attacks.
          </p>
        </GlassCard>

        <GlassCard>
          <SectionTag>06. Pixel Value Differencing (PVD)</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">Adaptive Pixel Pair Differencing</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            PVD calculates color differences between adjacent pixel pairs and embeds data adaptively based on smooth or sharp edge regions, enhancing payload capacity while maintaining visual quality.
          </p>
        </GlassCard>

        <GlassCard className="md:col-span-2">
          <SectionTag>07. Spatial Domain Steganography</SectionTag>
          <h3 className="font-display text-lg font-semibold text-white mt-3">Direct Spatial Matrix Manipulation</h3>
          <p className="text-xs text-surface-dim mt-2 leading-relaxed">
            Spatial Domain steganography embeds payload bits directly into raw pixel matrices without frequency transformation, enabling ultra-fast real-time processing and direct spatial verification.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
