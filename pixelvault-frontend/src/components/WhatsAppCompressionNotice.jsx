import SectionTag from "./ui/SectionTag";

export default function WhatsAppCompressionNotice({ compact = false }) {
  if (compact) {
    return (
      <div className="disclaimer-notice" role="note">
        <p className="text-sm font-medium text-white">WhatsApp compression warning</p>
        <p className="text-xs text-surface-dim mt-2 leading-relaxed">
          Photos and videos sent through WhatsApp are recompressed. Hidden data is usually
          destroyed. Use the original file — not a WhatsApp download or forward.
        </p>
      </div>
    );
  }

  return (
    <section className="opacity-0 animate-fade-up delay-3">
      <div className="glass-card section-block">
        <SectionTag>Important</SectionTag>
        <h2 className="font-display text-xl font-bold text-white mt-6">
          WhatsApp photo &amp; video compression
        </h2>
        <div className="disclaimer-notice mt-6">
          <p className="text-sm text-surface-text leading-relaxed">
            WhatsApp automatically recompresses photos and videos in chats, status updates, and
            forwards. That process changes pixel data and video frames, which typically breaks
            steganographic payloads embedded in images and video files.
          </p>
          <ul className="mt-5 space-y-4 text-sm text-surface-dim">
            <li className="flex gap-3">
              <span className="text-accent-pink shrink-0">✕</span>
              Do not hide data in files that were sent or received via WhatsApp
            </li>
            <li className="flex gap-3">
              <span className="text-accent-pink shrink-0">✕</span>
              Do not expect reveal to work on WhatsApp-saved photos or screen recordings
            </li>
            <li className="flex gap-3">
              <span className="text-accent-purple shrink-0">✓</span>
              Use original camera files, lossless PNG exports, or direct file transfer instead
            </li>
            <li className="flex gap-3">
              <span className="text-accent-purple shrink-0">✓</span>
              For images, prefer DST when the carrier may face mild recompression; LSB requires lossless files
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
