import { useState } from "react";
import DropZone from "../components/DropZone";
import Toast from "../components/Toast";
import ResultCard from "../components/ResultCard";
import { RevealScope } from "../components/ui/StegoVisuals";
import {
  Panel,
  SectionHeader,
  OptionGroup,
  PasswordField,
  PrimaryButton,
  WhatsAppWarning,
  CARRIERS,
  ALGORITHMS,
} from "../components/ui/ToolPrimitives";
import { revealPayload } from "../api/opaquepixel";
import { validatePassword } from "../utils/passwordValidator";
import { CARRIER_DOCUMENT_ACCEPT, CARRIER_AUDIO_ACCEPT } from "../utils/mimeTypes";

export default function RevealPage() {
  const [carrierType, setCarrierType] = useState("image");
  const [carrier, setCarrier] = useState(null);
  const [password, setPassword] = useState("");
  const [stegoMethod, setStegoMethod] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const carrierAccept =
    carrierType === "image"
      ? ".png,.jpg,.jpeg"
      : carrierType === "video"
        ? ".mp4"
        : carrierType === "audio"
          ? CARRIER_AUDIO_ACCEPT
          : CARRIER_DOCUMENT_ACCEPT;

  const handleCarrierTypeChange = (id) => {
    setCarrierType(id);
    setCarrier(null);
    setStegoMethod(id === "image" ? "auto" : "");
  };

  const handleCarrierChange = (file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setToast({
        message: "Warning: Stego files >10MB can trigger proxy timeouts. Consider using a smaller file.",
        type: "warning",
      });
    }
    setCarrier(file);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!carrier) return setToast({ message: "Please upload a stego file", type: "error" });
    const pwdError = validatePassword(password);
    if (pwdError) return setToast({ message: pwdError, type: "error" });

    setLoading(true);
    try {
      const data = await revealPayload({
        carrier,
        password,
        carrierType,
        stegoMethod: stegoMethod || undefined,
      });
      setResult(data);
      setToast({ message: "Hidden payload revealed successfully!", type: "success" });
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || "Failed to reveal payload";
      setToast({ message: typeof detail === "string" ? detail : "Failed to reveal payload", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setCarrier(null);
    setPassword("");
    setStegoMethod("auto");
  };

  return (
    <div className="px-6 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--orchid)]">
            Reveal
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl font-display font-semibold text-[color:var(--ink)]">
            Decrypt hidden payload
          </h1>
          <p className="mt-2 text-[color:var(--slate)]">
            Provide the stego file and the password used to seal it.
          </p>
        </header>

        <div className="mb-8">
          <RevealScope />
        </div>

        {result ? (
          <ResultCard result={result} onReset={reset} mode="reveal" />
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6">
            <Panel>
              <SectionHeader step="Step 01" title="Carrier" />
              <OptionGroup
                label="Carrier type"
                value={carrierType}
                onChange={handleCarrierTypeChange}
                options={CARRIERS}
              />
              <div className="mt-6">
                <WhatsAppWarning />
              </div>
              <div className="mt-6">
                <DropZone
                  label="Upload stego file"
                  hint="Drop or click to browse"
                  accept={carrierAccept}
                  file={carrier}
                  onFile={handleCarrierChange}
                />
              </div>
              <div className="mt-6">
                <OptionGroup
                  label="Algorithm"
                  value={stegoMethod}
                  onChange={setStegoMethod}
                  options={ALGORITHMS}
                />
              </div>
            </Panel>

            <Panel>
              <SectionHeader step="Step 02" title="Decrypt" />
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the encryption password"
              />
            </Panel>

            <div className="flex justify-end">
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Decrypting Payload…" : "Reveal payload"}
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
