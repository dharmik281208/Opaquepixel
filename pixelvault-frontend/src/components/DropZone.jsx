import { useState } from "react";

export default function DropZone({ label, accept, file, onFile, hint }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  };

  return (
    <div
      className={`group rounded-3xl border border-dashed transition-all duration-400 ${
        dragging
          ? "border-accent-purple/50 bg-accent-purple/5"
          : file
            ? "border-white/25 bg-white/[0.03]"
            : "border-surface-border hover:border-white/15 hover:bg-white/[0.02]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <label className="flex flex-col items-center justify-center p-10 md:p-12 cursor-pointer text-center">
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
        />
        <div className="w-14 h-14 mb-5 rounded-2xl glass flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg className="w-5 h-5 text-surface-muted group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-sm font-medium text-surface-text group-hover:text-white transition-colors">{label}</p>
        {file ? (
          <p className="mt-3 text-xs text-white font-mono">{file.name}</p>
        ) : (
          <p className="mt-3 text-xs text-surface-muted">{hint || "Drop or click to browse"}</p>
        )}
      </label>
    </div>
  );
}
