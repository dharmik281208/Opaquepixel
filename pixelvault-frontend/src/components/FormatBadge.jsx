const LABELS = { text: "TXT", document: "DOC", image: "IMG", video: "VID", audio: "AUD" };

export default function FormatBadge({ type }) {
  return (
    <span className="glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-surface-dim">
      {LABELS[type] || type}
    </span>
  );
}
