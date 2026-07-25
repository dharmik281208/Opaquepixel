const PIXELS = [
  [5, 5, 1],
  [13, 5, 0.35],
  [21, 5, 0.65],
  [5, 13, 0.45],
  [13, 13, 1],
  [21, 13, 0.3],
  [5, 21, 0.75],
  [13, 21, 0.4],
  [21, 21, 1],
];

export default function Logo({ size = "md", showText = true, animate = true, className = "" }) {
  const sizes = {
    sm: { box: "w-8 h-8", title: "text-base", sub: "text-[10px]" },
    md: { box: "w-9 h-9", title: "text-lg", sub: "text-xs" },
    lg: { box: "w-11 h-11", title: "text-xl", sub: "text-xs" },
    hero: { box: "w-14 h-14", title: "text-3xl", sub: "text-sm" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${s.box} rounded-xl bg-gradient-to-br from-[color:var(--orchid)] via-[color:var(--lilac)] to-[color:var(--warm)] p-1.5 flex items-center justify-center overflow-hidden shrink-0 relative shadow-[var(--shadow-soft)] transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 32 32" className="relative z-[1] w-full h-full" fill="none">
          {PIXELS.map(([x, y, o], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="6"
              height="6"
              rx="1.5"
              fill="#ffffff"
              className={animate ? "animate-pulse" : ""}
              style={{
                fillOpacity: o,
                animationDelay: animate ? `${i * 0.15}s` : undefined,
              }}
            />
          ))}
        </svg>
      </div>
      {showText && (
        <span className="font-display font-semibold tracking-tight text-[color:var(--ink)]">
          Opaque<span className="text-[color:var(--orchid)]">Pixel</span>
        </span>
      )}
    </div>
  );
}
