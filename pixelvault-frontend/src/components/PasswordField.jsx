import { useState } from "react";

export default function PasswordField({
  value,
  onChange,
  label = "Password",
  variant = "default",
  placeholder = "Min 8 characters",
  id,
}) {
  const [visible, setVisible] = useState(false);

  const input = (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pr-16 font-mono text-xs"
        minLength={8}
        required
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-surface-muted hover:text-white"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );

  if (variant === "embedded") {
    return input;
  }

  return (
    <div className="space-y-3">
      <label className="section-tag">{label}</label>
      {input}
    </div>
  );
}
