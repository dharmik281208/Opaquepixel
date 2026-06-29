import { formatSize } from "../utils/formatSize";

export default function CapacityBar({ payloadSize, capacity, loading }) {
  if (loading) return <p className="text-xs text-surface-muted animate-pulse">Calculating…</p>;
  if (!capacity) return null;

  const ratio = payloadSize / capacity;
  const pct = Math.min(ratio * 100, 100);
  const ok = ratio <= 1;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-surface-muted">
        <span>Payload {formatSize(payloadSize)}</span>
        <span className={ok ? "text-accent-purple" : "text-accent-pink"}>
          {formatSize(capacity)} {ok ? "" : "exceeded"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            ok ? "bg-gradient-to-r from-accent-purple to-accent-blue" : "bg-accent-pink"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
