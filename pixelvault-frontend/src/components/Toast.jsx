export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] inline-flex items-center justify-center gap-3 glass rounded-full px-6 py-3.5 text-sm font-medium text-white shadow-2xl animate-fade-up pointer-events-auto max-w-[90vw] text-center"
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-2 text-surface-muted hover:text-white transition-colors">
          ×
        </button>
      )}
    </div>
  );
}
