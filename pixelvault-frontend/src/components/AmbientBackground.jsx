export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 gradient-flow-base" />

      {/* Flowing aurora bands */}
      <div className="absolute inset-0 bg-aurora-flow opacity-60" />

      <div
        className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full animate-gradient-shift opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.28) 0%, rgba(99,102,241,0.12) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="absolute -bottom-1/4 -right-1/4 w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full animate-gradient-shift opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)",
          filter: "blur(90px)",
          animationDelay: "-8s",
          animationDirection: "reverse",
        }}
      />

      <div
        className="absolute top-[20%] right-[5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full animate-float opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[45vh] animate-pulse-glow"
        style={{
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Diagonal gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,12,0.35) 55%, rgba(10,10,12,0.88) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
