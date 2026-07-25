import { useEffect, useRef } from "react";

export function PixelCipherBg() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const CELL = 22;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let bits = new Uint8Array(0);
    let heat = new Float32Array(0);
    const pointer = { x: -9999, y: -9999 };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        a: s.getPropertyValue("--orchid").trim() || "oklch(0.65 0.10 305)",
        b: s.getPropertyValue("--lilac").trim() || "oklch(0.72 0.08 320)",
        c: s.getPropertyValue("--warm").trim() || "oklch(0.80 0.03 25)",
      };
    };
    let colors = readColors();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      bits = new Uint8Array(cols * rows);
      heat = new Float32Array(cols * rows);
      for (let i = 0; i < bits.length; i++) {
        bits[i] = Math.random() > 0.5 ? 1 : 0;
        heat[i] = Math.random() * 0.35;
      }
    };

    resize();

    const onResize = () => {
      resize();
      colors = readColors();
    };
    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top + window.scrollY;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    const themeObserver = new MutationObserver(() => {
      colors = readColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += reduce ? 0.0015 : 0.006;
      ctx.clearRect(0, 0, w, h);

      const sweep = ((t * 0.35) % 1.4) - 0.2;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const px = x * CELL;
          const py = y * CELL;

          if (Math.random() < (reduce ? 0.0008 : 0.004)) bits[i] ^= 1;

          const nx = w === 0 ? 0 : px / w;
          const ny = h === 0 ? 0 : py / h;
          const d = Math.abs(nx * 0.75 + ny * 0.25 - sweep);
          if (d < 0.045) {
            heat[i] = Math.min(1, heat[i] + 0.5);
            if (Math.random() < 0.5) bits[i] ^= 1;
          }

          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) heat[i] = Math.min(1, heat[i] + (1 - dist / 130) * 0.14);

          heat[i] *= 0.955;

          const energy = heat[i];
          const base = bits[i] ? 0.1 : 0.045;
          const alpha = base + energy * 0.65;
          if (alpha < 0.03) continue;

          const tone = energy > 0.55 ? colors.a : energy > 0.25 ? colors.b : colors.c;
          ctx.fillStyle = tone;
          ctx.globalAlpha = alpha;

          const size = bits[i] ? 3 + energy * 6 : 2 + energy * 3;
          const off = (CELL - size) / 2;
          ctx.fillRect(px + off, py + off, size, size);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 40% at 50% 0%, color-mix(in oklab, var(--lilac) 10%, transparent), transparent 70%), radial-gradient(60% 50% at 50% 100%, color-mix(in oklab, var(--orchid) 12%, transparent), transparent 70%)",
        }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage: "radial-gradient(80% 60% at 50% 30%, black, transparent 85%)",
          WebkitMaskImage: "radial-gradient(80% 60% at 50% 30%, black, transparent 85%)",
        }}
      />
    </div>
  );
}
