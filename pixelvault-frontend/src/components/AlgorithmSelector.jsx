export default function AlgorithmSelector({
  value,
  onChange,
  disabled = false,
  mode = "default",
}) {
  if (disabled) return null;

  const isScan = mode === "scan";

  const METHODS = [
    isScan
      ? { id: "all", label: "All Algorithms", note: "Comprehensive Scan" }
      : { id: "auto", label: "Auto", note: "Recommended · Smart" },
    { id: "dst", label: "DST", note: "Compression resistant" },
    { id: "lsb", label: "LSB", note: "Fast · lossless PNG" },
    { id: "matrix", label: "Matrix", note: "High Security · Robust" },
    { id: "f5", label: "F5", note: "Matrix DCT Encoding" },
    { id: "pvd", label: "PVD", note: "Pixel Differencing" },
    { id: "spatial", label: "Spatial", note: "Direct Spatial Domain" },
  ];

  const isSelected = (val, id) => {
    if (isScan && (val === "auto" || val === "all") && id === "all") return true;
    if (!isScan && (val === "auto" || val === "all") && id === "auto") return true;
    return val === id;
  };

  return (
    <div className="space-y-4">
      <span className="section-tag">Algorithm</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {METHODS.map((method) => {
          const active = isSelected(value, method.id);
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              className={`algo-option ${active ? "algo-option-active" : ""}`}
            >
              <span className="block text-sm font-semibold">{method.label}</span>
              <span className="block text-xs mt-1.5 opacity-75">{method.note}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
