import { useRef } from "react";

export default function GlassCard({ children, className = "", hover = true }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (!hover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--x", `${x}px`);
    ref.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`glass-card relative overflow-hidden ${className}`}
    >
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(400px circle at var(--x,50%) var(--y,50%), rgba(168,85,247,0.08), transparent 50%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
