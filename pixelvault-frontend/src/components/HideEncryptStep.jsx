import GlassCard from "./GlassCard";
import PasswordField from "./PasswordField";
import SectionTag from "./ui/SectionTag";
import { checkPasswordRequirements } from "../utils/passwordValidator";

const CRYPTO_SPECS = [
  { label: "Algorithm", value: "AES-256-GCM" },
  { label: "Key derivation", value: "PBKDF2 · 600k" },
  { label: "Mode", value: "Authenticated" },
];

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-purple">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function getPasswordStrength(reqs, password) {
  if (!password) return null;
  const count = Object.values(reqs).filter(Boolean).length;
  if (count === 5) return { level: "strong", label: "Strong" };
  if (count >= 3) return { level: "fair", label: "Fair" };
  return { level: "weak", label: "Weak" };
}

export default function HideEncryptStep({ password, onChange }) {
  const reqs = checkPasswordRequirements(password);
  const strength = getPasswordStrength(reqs, password);

  const requirementItems = [
    { key: "length", label: "At least 8 characters" },
    { key: "uppercase", label: "1 uppercase letter (A-Z)" },
    { key: "lowercase", label: "1 lowercase letter (a-z)" },
    { key: "number", label: "1 number (0-9)" },
    { key: "special", label: "1 special character (!@#...)" },
  ];

  return (
    <GlassCard className="opacity-0 animate-fade-up delay-3 encrypt-step">
      <header className="encrypt-step-header">
        <div className="encrypt-step-intro">
          <SectionTag>Step 03</SectionTag>
          <h2 className="encrypt-step-title">Encrypt</h2>
          <p className="encrypt-step-lead">
            Your payload is encrypted before embedding. Only this password can decrypt it on reveal.
          </p>
        </div>
        <div className="encrypt-lock-badge" aria-hidden>
          <LockIcon />
        </div>
      </header>

      <ul className="encrypt-specs" aria-label="Encryption specifications">
        {CRYPTO_SPECS.map(({ label, value }) => (
          <li key={label} className="encrypt-spec-chip">
            <p className="encrypt-spec-label">{label}</p>
            <p className="encrypt-spec-value">{value}</p>
          </li>
        ))}
      </ul>

      <div className="encrypt-password-panel">
        <div className="encrypt-password-head">
          <label htmlFor="hide-encrypt-password" className="encrypt-panel-label">
            Encryption password
          </label>
          <span className="encrypt-required-badge">Protected</span>
        </div>

        <PasswordField
          id="hide-encrypt-password"
          value={password}
          onChange={onChange}
          variant="embedded"
          placeholder="Enter a strong password"
        />

        {strength && (
          <div className="password-strength" aria-live="polite">
            <div className="password-strength-track">
              <div className={`password-strength-fill strength-${strength.level}`} />
            </div>
            <p className="password-strength-label">{strength.label}</p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {requirementItems.map(({ key, label }) => {
            const met = reqs[key];
            return (
              <div
                key={key}
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  met ? "text-emerald-400 font-medium" : "text-surface-muted"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
                  met ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-surface-muted border border-white/10"
                }`}>
                  {met ? "✓" : "•"}
                </span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <p className="encrypt-field-hint">
          Use a unique password. It is never stored — if you lose it, the hidden data cannot be recovered.
        </p>
      </div>

      <footer className="encrypt-footer">
        <span className="encrypt-footer-icon" aria-hidden>!</span>
        <p>
          Encryption runs on the server after upload. The carrier file only contains the encrypted blob — not your
          password or plain payload.
        </p>
      </footer>
    </GlassCard>
  );
}

