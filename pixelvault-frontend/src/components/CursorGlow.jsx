import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const primaryRef = useRef(null);
  const trailRef = useRef(null);
  const state = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    tx: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    ty: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    trailX: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    trailY: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });
  const raf = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      state.current.tx = e.clientX;
      state.current.ty = e.clientY;
    };

    const tick = () => {
      const s = state.current;
      s.x += (s.tx - s.x) * 0.12;
      s.y += (s.ty - s.y) * 0.12;
      s.trailX += (s.tx - s.trailX) * 0.05;
      s.trailY += (s.ty - s.trailY) * 0.05;

      if (primaryRef.current) {
        primaryRef.current.style.transform = `translate(${s.x}px, ${s.y}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${s.trailX}px, ${s.trailY}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div ref={trailRef} className="cursor-glow-trail" />
      <div ref={primaryRef} className="cursor-glow-primary" />
    </div>
  );
}
