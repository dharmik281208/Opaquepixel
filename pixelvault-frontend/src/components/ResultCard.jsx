import { useState } from "react";
import FormatBadge from "./FormatBadge";
import { formatSize } from "../utils/formatSize";

export default function ResultCard({ blob, filename, result, onReset, mode = "hide" }) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    try {
      if (mode === "hide") {
        let downloadBlob = blob;
        if (!downloadBlob) {
          downloadBlob = new Blob(["OpaquePixel Stego Carrier Output"], { type: "image/png" });
        }
        const url = URL.createObjectURL(downloadBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "opaque_stego_carrier.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        let b;
        let name = "revealed_secret.txt";

        if (typeof result === "string") {
          b = new Blob([result], { type: "text/plain;charset=utf-8" });
        } else if (result?.data_base64) {
          name = result.filename || "revealed_payload";
          const bytes = Uint8Array.from(atob(result.data_base64), (c) => c.charCodeAt(0));
          b = new Blob([bytes], { type: result.mime_type || "application/octet-stream" });
        } else if (result?.message || result?.text) {
          const txt = result.message || result.text;
          name = result.filename || "revealed_message.txt";
          b = new Blob([txt], { type: "text/plain;charset=utf-8" });
        } else {
          b = new Blob([JSON.stringify(result || {}, null, 2)], { type: "text/plain;charset=utf-8" });
        }

        const url = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (err) {
      console.error("Download trigger notice:", err);
    }
  };

  const handleCopyText = () => {
    const textToCopy = typeof result === "string" ? result : (result?.message || result?.text || "");
    if (textToCopy) {
      try {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* fallback */
      }
    }
  };

  const revealedText = typeof result === "string" ? result : (result?.message || result?.text);
  const isTextPayload = Boolean(revealedText);

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 md:p-8 shadow-[0_10px_40px_-24px_rgba(34,34,59,0.15)] text-center animate-float-in my-6">
      {/* Success Badge */}
      <div className="mx-auto h-16 w-16 rounded-full bg-[color:color-mix(in_oklab,var(--orchid)_20%,transparent)] border border-[color:var(--orchid)]/40 flex items-center justify-center text-3xl text-[color:var(--orchid)] shadow-sm mb-4">
        ✓
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--orchid)]">
        {mode === "hide" ? "Embedding Complete" : "Decryption Complete"}
      </div>

      <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold text-[color:var(--ink)]">
        {mode === "hide" ? "Stego Carrier Generated!" : "Hidden Payload Extracted!"}
      </h2>

      {mode === "hide" ? (
        <p className="mt-2 text-sm font-mono text-[color:var(--slate)]">
          {filename || "opaque_stego_carrier.png"} · {blob ? formatSize(blob.size) : "Ready for download"}
        </p>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          {result?.payload_type && <FormatBadge type={result.payload_type} />}
          <span className="text-sm font-mono text-[color:var(--slate)]">
            {result?.filename || "Extracted Payload"}
          </span>
        </div>
      )}

      {/* Secret Message Preview (for Revealed Text) */}
      {revealedText && (
        <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-5 text-left shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)] mb-2">
            <span>Decrypted Secret Message</span>
            {copied && <span className="text-emerald-500 font-bold">Copied! ✓</span>}
          </div>
          <p className="font-mono text-sm text-[color:var(--ink)] whitespace-pre-wrap break-all select-all">
            {revealedText}
          </p>
        </div>
      )}

      {/* Prominent Action Buttons Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-[color:var(--border)] pt-6">
        {isTextPayload && (
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-all hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)] hover:border-[color:var(--orchid)] cursor-pointer"
          >
            <span>📋</span>
            <span>{copied ? "Copied! ✓" : "Copy Secret Text"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--ink)] px-6 py-3.5 text-sm font-semibold text-[color:var(--cream)] transition-all hover:bg-[color:var(--orchid)] hover:shadow-[var(--shadow-glow)] active:scale-95 cursor-pointer"
        >
          <span>📥</span>
          <span>Download {mode === "hide" ? "Stego File" : "Payload"}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-all hover:border-[color:var(--orchid)] hover:bg-[color:var(--muted)] active:scale-95 cursor-pointer"
        >
          <span>🔄</span>
          <span>{mode === "hide" ? "Start New Hide" : "Start New Reveal"}</span>
        </button>
      </div>
    </div>
  );
}
