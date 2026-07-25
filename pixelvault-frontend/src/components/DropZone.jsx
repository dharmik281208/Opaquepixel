import { useState, useCallback } from "react";

export default function DropZone({ label = "Drop or click to browse", hint, accept, file, onFile }) {
  const [over, setOver] = useState(false);

  const handle = useCallback(
    (f) => {
      if (!f) return;
      onFile?.(f);
    },
    [onFile]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    handle(e.dataTransfer.files?.[0]);
  };

  const onChange = (e) => handle(e.target.files?.[0]);

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
        over
          ? "border-[color:var(--orchid)] bg-[color:color-mix(in_oklab,var(--lilac)_15%,transparent)] shadow-[var(--shadow-glow)] scale-[1.01]"
          : file
            ? "border-[color:var(--orchid)] bg-[color:color-mix(in_oklab,var(--lilac)_10%,transparent)]"
            : "border-[color:var(--dusk)] bg-[color:color-mix(in_oklab,var(--cream)_60%,transparent)] hover:border-[color:var(--lilac)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_8%,transparent)]"
      }`}
    >
      <input type="file" accept={accept} onChange={onChange} className="sr-only" />
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)] text-[color:var(--orchid)] transition-transform group-hover:scale-110 ${
          over ? "animate-pulse-glow" : ""
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div>
        <div className="font-medium text-[color:var(--ink)]">
          {file ? file.name : label}
        </div>
        {(hint || file) && (
          <div className="mt-1 text-xs text-[color:var(--slate)]">
            {file ? `${(file.size / 1024).toFixed(1)} KB · click to replace` : hint}
          </div>
        )}
      </div>
    </label>
  );
}
