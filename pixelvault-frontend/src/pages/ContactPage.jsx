import { useState } from "react";
import Toast from "../components/Toast";
import { CipherSignature } from "../components/ui/StegoVisuals";
import { Panel, SectionHeader, PrimaryButton } from "../components/ui/ToolPrimitives";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setToast({ message: "Please fill out all fields", type: "error" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setToast({ message: "Message sent! Dharmik will get back to you shortly.", type: "success" });
      setForm({ name: "", email: "", message: "" });
    }, 600);
  };

  return (
    <div className="px-6 py-16">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <aside className="animate-float-in space-y-6">
          <CipherSignature />
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-7 shadow-[var(--shadow-soft)]">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--orchid)]">
              Lead developer &amp; cybersecurity researcher
            </div>
            <h1 className="mt-2 text-3xl font-display font-semibold text-[color:var(--ink)]">
              Dharmik Suhagiya
            </h1>
            <p className="mt-2 text-sm text-[color:var(--slate)]">Computer Science Engineering</p>
            <p className="mt-4 text-sm text-[color:var(--slate)]">
              Developer of OpaquePixel, specializing in spatial &amp; frequency-domain
              steganography algorithms, AES-256-GCM cryptography, and web application security.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://github.com/dharmik281208"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/dhrmik-suhagiya-aab167315/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]"
              >
                LinkedIn
              </a>
              <a
                href="mailto:dhrmiksuhagiya@gmail.com"
                className="rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] hover:bg-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]"
              >
                Email
              </a>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5">
              <div className="text-xs uppercase tracking-widest text-[color:var(--dusk)]">Institution</div>
              <div className="mt-1 font-display text-lg text-[color:var(--ink)]">College</div>
              <div className="text-sm text-[color:var(--slate)]">Dr. S. &amp; S.S. Ghandhy College of Engg. &amp; Tech.</div>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5">
              <div className="text-xs uppercase tracking-widest text-[color:var(--dusk)]">Location</div>
              <div className="mt-1 font-display text-lg text-[color:var(--ink)]">Base</div>
              <div className="text-sm text-[color:var(--slate)]">Surat, Gujarat, India</div>
            </div>
          </div>
        </aside>

        <Panel>
          <SectionHeader
            step="Inquiry & projects"
            title="Send a message"
            kicker="Interested in collaboration or security research? Leave your details below."
          />
          <form onSubmit={handleSubmit} className="grid gap-5">
            <Field label="Your name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Your email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="jane@domain.com"
              />
            </Field>
            <Field label="Message / collaboration proposal">
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input resize-none"
                placeholder="Tell me about your project…"
              />
            </Field>
            <div className="flex justify-end">
              <PrimaryButton type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send message"}
              </PrimaryButton>
            </div>
          </form>
        </Panel>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--input);
          background: var(--card);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: var(--orchid);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--lilac) 25%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
