import { useState } from "react";
import FormatBadge from "./FormatBadge";
import { formatSize } from "../utils/formatSize";

export default function ResultCard({ blob, filename, result, onReset, mode = "hide" }) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (mode === "hide" && blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "stego_carrier.png";
      a.click();
      URL.revokeObjectURL(url);
    } else if (result) {
      let b;
      let name = result.filename || "revealed_payload.txt";
      if (result.data_base64) {
        const bytes = Uint8Array.from(atob(result.data_base64), (c) => c.charCodeAt(0));
        b = new Blob([bytes], { type: result.mime_type || "application/octet-stream" });
      } else if (result.message) {
        b = new Blob([result.message], { type: "text/plain;charset=utf-8" });
        if (!name.endsWith(".txt")) name += ".txt";
      }

      if (b) {
        const url = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleCopyText = () => {
    if (result?.message) {
      navigator.clipboard.writeText(result.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isTextPayload = result?.payload_type === "text" || (result?.message && !result?.data_base64);

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow-soft)] text-center animate-float-in my-6">
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
          {filename} · {blob ? formatSize(blob.size) : "Ready for download"}
        </p>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          {result?.payload_type && <FormatBadge type={result.payload_type} />}
          <span className="text-sm font-mono text-[color:var(--slate)]">
            {result?.filename || "Extracted Secret"}
          </span>
        </div>
      )}

      {/* Secret Message Preview (for Revealed Text) */}
      {result?.message && (
        <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-5 text-left shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)] mb-2">
            <span>Decrypted Secret Text</span>
            {copied && <span className="text-emerald-500 font-bold">Copied to clipboard! ✓</span>}
          </div>
          <p className="font-mono text-sm text-[color:var(--ink)] whitespace-pre-wrap break-all select-all">
            {result.message}
          </p>
        </div>
      )}

      {/* Action Buttons: Download & New */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {isTextPayload && (
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--muted)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-all hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)] hover:border-[color:var(--orchid)] cursor-pointer"
          >
            {copied ? "Copied! ✓" : "Copy Text 📋"}
          </button>
        )}

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-[color:var(--cream)] transition-all hover:bg-[color:var(--orchid)] hover:shadow-[var(--shadow-glow)] cursor-pointer"
        >
          <span>Download {mode === "hide" ? "Stego Media" : "Payload"}</span>
          <span>↓</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-all hover:border-[color:var(--orchid)] hover:bg-[color:var(--muted)] cursor-pointer"
        >
          <span>Start New</span>
          <span>↻</span>
        </button>
      </div>
    </div>
  );
}
