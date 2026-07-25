import { useEffect, useRef } from "react";

export function CursorGlow() {
  const followerRef = useRef(null);
  const dotRef = useRef(null);
  const idleTimer = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const setIdle = (idle) => {
      followerRef.current?.classList.toggle("is-idle", idle);
      if (dotRef.current) dotRef.current.style.opacity = idle ? "0" : "1";
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--cursor-x", `${x}px`);
        root.style.setProperty("--cursor-y", `${y}px`);
        raf = 0;
      });
      setIdle(false);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIdle(true), 2500);
    };

    const onLeave = () => setIdle(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={followerRef} className="cursor-follower is-idle" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden style={{ opacity: 0 }} />
    </>
  );
}
