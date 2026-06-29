const MODES = [
  { id: "text", label: "Text" },
  { id: "document", label: "Doc" },
  { id: "image", label: "Photo" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

export default function ModeSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`carrier-chip carrier-chip-pill text-xs font-medium tracking-wide ${
            value === mode.id ? "carrier-chip-active scale-[1.02]" : ""
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
