const ITEMS = [
  "Steganography",
  "AES-256-GCM",
  "Image · Video · Doc",
  "Privacy Research",
  "Educational Use",
  "Lawful Only",
];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
    <span key={i} className="marquee-item">
      {item}
      <span className="marquee-dot" aria-hidden />
    </span>
  ));

  return (
    <div className="marquee-wrap opacity-0 animate-fade-up delay-1" aria-hidden>
      <div className="marquee-track">{track}</div>
    </div>
  );
}
