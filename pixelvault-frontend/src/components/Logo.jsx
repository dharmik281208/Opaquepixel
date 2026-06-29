const PIXELS = [
  [5, 5, 1], [13, 5, 0.25], [21, 5, 0.55], [5, 13, 0.35],
  [13, 13, 1], [21, 13, 0.2], [5, 21, 0.65], [13, 21, 0.3], [21, 21, 1],
];

export default function Logo({ size = "md", showText = true, animate = true, className = "" }) {
  const sizes = {
    sm: { box: "w-11 h-11", title: "text-base", sub: "text-[10px]" },
    md: { box: "w-13 h-13", title: "text-lg", sub: "text-xs" },
    lg: { box: "w-16 h-16", title: "text-2xl", sub: "text-xs" },
    hero: { box: "w-20 h-20", title: "text-3xl", sub: "text-sm" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-3.5 ${animate ? "logo-wrap" : ""} ${className}`}>
      <div
        className={`${s.box} logo-box glass rounded-2xl flex items-center justify-center overflow-hidden shrink-0 relative ${
          animate ? "logo-box-animated" : ""
        }`}
      >
        {animate && <div className="logo-shimmer" aria-hidden />}
        <svg viewBox="0 0 32 32" className="relative z-[1] w-[60%] h-[60%]" fill="none">
          {PIXELS.map(([x, y, o], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="6"
              height="6"
              rx="1.5"
              fill="#34d399"
              className={animate ? "logo-pixel" : ""}
              style={{
                fillOpacity: o,
                animationDelay: animate ? `${i * 0.15}s` : undefined,
                "--pixel-base": o,
              }}
            />
          ))}
        </svg>
      </div>
      {showText && (
        <div className={`leading-none ${animate ? "logo-text-group" : ""}`}>
          <span className={`font-display font-bold ${s.title} logo-title-text block`}>
            Opaque
          </span>
          <span className={`block font-display font-medium tracking-[0.3em] ${s.sub} logo-sub-text mt-1`}>
            PIXEL
          </span>
        </div>
      )}
    </div>
  );
}
