import { useState } from "react";
import DropZone from "../components/DropZone";
import GlassCard from "../components/GlassCard";
import CarrierTypeSelector from "../components/CarrierTypeSelector";
import AlgorithmSelector from "../components/AlgorithmSelector";
import PasswordField from "../components/PasswordField";
import ResultCard from "../components/ResultCard";
import Toast from "../components/Toast";
import WhatsAppCompressionNotice from "../components/WhatsAppCompressionNotice";
import PageHero from "../components/ui/PageHero";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carrier) return setToast({ message: "Upload stego file", type: "error" });
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
      setToast({ message: "Revealed", type: "success" });
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || "Failed";
      setToast({ message: typeof detail === "string" ? detail : "Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setCarrier(null);
    setPassword("");
    setStegoMethod("");
  };

  if (result) {
    return (
      <>
        <ResultCard result={result} onReset={reset} mode="reveal" />
        <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="page-stack workspace-page">
      <PageHero
        tag="Workspace"
        title="Reveal"
        lead="Extract hidden data from a stego carrier."
      />

      <form onSubmit={handleSubmit} className="card-stack">
        <GlassCard className="opacity-0 animate-fade-up delay-1 card-inner">
          <div className="step-block">
            <span className="section-tag">Step 01</span>
            <h2 className="step-title">Carrier</h2>
            <CarrierTypeSelector value={carrierType} onChange={handleCarrierTypeChange} />
          </div>

          {(carrierType === "image" || carrierType === "video") && (
            <WhatsAppCompressionNotice compact />
          )}

          <DropZone label="Upload stego file" accept={carrierAccept} file={carrier} onFile={setCarrier} />

          <AlgorithmSelector
            value={stegoMethod}
            onChange={setStegoMethod}
            disabled={carrierType !== "image"}
          />
        </GlassCard>

        <GlassCard className="opacity-0 animate-fade-up delay-2 card-inner">
          <div className="step-block">
            <span className="section-tag">Step 02</span>
            <h2 className="step-title">Decrypt</h2>
          </div>
          <PasswordField value={password} onChange={setPassword} />
        </GlassCard>

        <button type="submit" disabled={loading} className="btn-primary w-full opacity-0 animate-fade-up delay-3">
          {loading ? "Processing…" : "Reveal payload →"}
        </button>
      </form>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
