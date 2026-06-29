import { CARRIER_TYPES } from "../utils/mimeTypes";

export default function CarrierTypeSelector({ value, onChange, compact = false }) {
  return (
    <div className={compact ? "flex flex-wrap gap-3" : "grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"}>
      {CARRIER_TYPES.map(({ id, label, hint }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`carrier-chip ${value === id ? "carrier-chip-active" : ""} ${
            compact ? "carrier-chip-pill" : ""
          }`}
        >
          <span className="block text-xs font-semibold">{label}</span>
          {!compact && hint && (
            <span className="block text-[10px] mt-1 opacity-70">{hint}</span>
          )}
        </button>
      ))}
    </div>
  );
}
