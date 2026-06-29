import GlassCard from "./GlassCard";
import FormatBadge from "./FormatBadge";
import { formatSize } from "../utils/formatSize";

export default function ResultCard({ blob, filename, result, onReset, mode = "hide" }) {
  const handleDownload = () => {
    if (mode === "hide" && blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else if (result) {
      const bytes = Uint8Array.from(atob(result.data_base64), (c) => c.charCodeAt(0));
      const b = new Blob([bytes], { type: result.mime_type });
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <GlassCard className="max-w-lg mx-auto text-center opacity-100 animate-fade-up section-block">
      <div className="w-16 h-16 mx-auto rounded-full glass flex items-center justify-center text-2xl">
        ✓
      </div>
      <div>
        <span className="section-tag">{mode === "hide" ? "Complete" : "Revealed"}</span>
        <h2 className="font-display text-2xl font-bold text-white mt-4">
          {mode === "hide" ? "Payload hidden" : "Payload extracted"}
        </h2>
        {mode === "hide" ? (
          <p className="mt-2 text-xs font-mono text-surface-dim">
            {filename} · {formatSize(blob.size)}
          </p>
        ) : (
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <FormatBadge type={result.payload_type} />
            <span className="text-xs font-mono text-surface-dim">{result.filename}</span>
          </div>
        )}
      </div>

      {result?.message && (
        <div className="rounded-2xl border border-surface-border bg-white/[0.02] p-4 text-left">
          <p className="text-sm font-mono whitespace-pre-wrap">{result.message}</p>
        </div>
      )}

      <div className="flex gap-4 justify-center pt-4">
        {(mode === "hide" || result?.payload_type !== "text") && (
          <button onClick={handleDownload} className="btn-primary">
            Download
          </button>
        )}
        <button onClick={onReset} className="btn-ghost">
          New
        </button>
      </div>
    </GlassCard>
  );
}
