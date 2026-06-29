import { useState } from "react";

export default function AuthScanZone({ file, onFile, loading }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  };

  return (
    <label
      className={`group relative block cursor-pointer overflow-hidden rounded-3xl border transition-all duration-500 ${
        dragging
          ? "border-accent-purple/60 bg-accent-purple/5 shadow-glow"
          : file
            ? "border-white/30 bg-white/[0.04]"
            : "border-surface-border bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col items-center justify-center px-8 py-16 md:py-20 text-center">
        <div
          className={`mb-6 w-16 h-16 rounded-2xl glass flex items-center justify-center transition-transform duration-500 ${
            dragging ? "scale-110 shadow-glow" : "group-hover:scale-105"
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-surface-dim group-hover:text-white transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-18 0h2M4.93 4.93l.707.707M18.364 5.636l-.707.707M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
          </svg>
        </div>

        {loading ? (
          <p className="text-sm text-white animate-pulse">Verifying token…</p>
        ) : file ? (
          <>
            <p className="text-sm font-medium text-white">Token ready</p>
            <p className="mt-2 text-xs font-mono text-surface-dim">{file.name}</p>
          </>
        ) : (
          <>
            <p className="text-base font-medium text-surface-text group-hover:text-white transition-colors">
              Upload auth QR
            </p>
            <p className="mt-3 text-xs text-surface-muted max-w-xs leading-relaxed">
              Drop your authorized token image to unlock the platform
            </p>
          </>
        )}
      </div>
    </label>
  );
}
