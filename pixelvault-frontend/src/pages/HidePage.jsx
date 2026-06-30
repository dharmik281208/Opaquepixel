import { useState, useEffect } from "react";
import DropZone from "../components/DropZone";
import GlassCard from "../components/GlassCard";
import ModeSelector from "../components/ModeSelector";
import CarrierTypeSelector from "../components/CarrierTypeSelector";
import AlgorithmSelector from "../components/AlgorithmSelector";
import CapacityBar from "../components/CapacityBar";
import HideEncryptStep from "../components/HideEncryptStep";
import ResultCard from "../components/ResultCard";
import Toast from "../components/Toast";
import WhatsAppCompressionNotice from "../components/WhatsAppCompressionNotice";
import PageHero from "../components/ui/PageHero";
import { hidePayload } from "../api/opaquepixel";
import { validatePassword } from "../utils/passwordValidator";
import {
  PAYLOAD_ACCEPT,
  CARRIER_DOCUMENT_ACCEPT,
  CARRIER_AUDIO_ACCEPT,
  getPayloadSize,
  getStegoFilename,
  estimateCarrierCapacity,
} from "../utils/mimeTypes";

export default function HidePage() {
  const [carrierType, setCarrierType] = useState("image");
  const [payloadMode, setPayloadMode] = useState("text");
  const [stegoMethod, setStegoMethod] = useState("auto");
  const [carrier, setCarrier] = useState(null);
  const [payloadFile, setPayloadFile] = useState(null);
  const [payloadText, setPayloadText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [capacity, setCapacity] = useState(0);
  const [capacityLoading, setCapacityLoading] = useState(false);

  const payloadSize = getPayloadSize(payloadMode, payloadFile, payloadText);

  const handleCarrierTypeChange = (id) => {
    setCarrierType(id);
    setCarrier(null);
    setCapacity(0);
    setStegoMethod(id === "image" ? "auto" : "");
  };

  useEffect(() => {
    if (!carrier) {
      setCapacity(0);
      return;
    }
    setCapacityLoading(true);
    estimateCarrierCapacity(carrierType, carrier, stegoMethod).then((cap) => {
      setCapacity(cap);
      setCapacityLoading(false);
    });
  }, [carrier, carrierType, stegoMethod]);

  const carrierAccept =
    carrierType === "image"
      ? ".png,.jpg,.jpeg"
      : carrierType === "video"
        ? ".mp4"
        : carrierType === "audio"
          ? CARRIER_AUDIO_ACCEPT
          : CARRIER_DOCUMENT_ACCEPT;

  const carrierHint =
    carrierType === "image"
      ? "Higher resolution = more capacity"
      : carrierType === "video"
        ? "MP4 carrier"
        : carrierType === "audio"
          ? "MP3, WAV, FLAC, OGG, M4A, AAC, WMA, OPUS, AIFF, WEBA"
          : "PDF, DOCX, PPTX, ODT, RTF, TXT…";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carrier) return setToast({ message: "Upload a carrier", type: "error" });
    const pwdError = validatePassword(password);
    if (pwdError) return setToast({ message: pwdError, type: "error" });
    if (payloadMode === "text" && !payloadText.trim()) return setToast({ message: "Enter message", type: "error" });
    if (payloadMode !== "text" && !payloadFile) return setToast({ message: "Upload payload", type: "error" });

    setLoading(true);
    try {
      const blob = await hidePayload({
        carrier,
        payload: payloadFile,
        payloadText,
        payloadType: payloadMode,
        password,
        carrierType,
        stegoMethod,
      });
      setResult({ blob, filename: getStegoFilename(carrierType, carrier) });
      setToast({ message: "Done", type: "success" });
    } catch (err) {
      let msg = "Failed";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          msg = json.detail || msg;
        } catch {
          msg = err.message || msg;
        }
      } else {
        msg = err.response?.data?.detail || err.message || msg;
      }
      setToast({ message: typeof msg === "string" ? msg : "Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCarrierChange = (file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setToast({
        message: "Warning: Carrier files >10MB can trigger Render proxy timeouts. Consider using a smaller image.",
        type: "warning"
      });
    }
    setCarrier(file);
  };

  const handlePayloadFileChange = (file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setToast({
        message: "Warning: Payloads >5MB can trigger Render proxy timeouts. Consider using a smaller file.",
        type: "warning"
      });
    }
    setPayloadFile(file);
  };

  const reset = () => {
    setResult(null);
    setCarrier(null);
    setPayloadFile(null);
    setPayloadText("");
    setPassword("");
  };

  if (result) {
    return (
      <>
        <ResultCard blob={result.blob} filename={result.filename} onReset={reset} />
        <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="page-stack workspace-page">
      <PageHero
        tag="Workspace"
        title="Hide"
        lead="Embed encrypted data inside a carrier file."
      />

      <form onSubmit={handleSubmit} className="card-stack">
        <GlassCard className="opacity-0 animate-fade-up delay-1 card-inner">
          <div className="step-block">
            <span className="section-tag">Step 01</span>
            <h2 className="step-title">Carrier</h2>
            <CarrierTypeSelector
              value={carrierType}
              onChange={(id) => {
                setCarrierType(id);
                setCarrier(null);
              }}
            />
          </div>
          {(carrierType === "image" || carrierType === "video") && (
            <WhatsAppCompressionNotice compact />
          )}
          <DropZone label={`Upload ${carrierType}`} accept={carrierAccept} file={carrier} onFile={handleCarrierChange} hint={carrierHint} />
          <AlgorithmSelector value={stegoMethod} onChange={setStegoMethod} disabled={carrierType !== "image"} />
        </GlassCard>

        <GlassCard className="opacity-0 animate-fade-up delay-2 card-inner">
          <div className="step-block">
            <span className="section-tag">Step 02</span>
            <h2 className="step-title">Payload</h2>
            <ModeSelector value={payloadMode} onChange={setPayloadMode} />
          </div>
          {payloadMode === "text" ? (
            <textarea
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              placeholder="Secret message…"
              rows={4}
              className="input-field resize-none font-mono text-xs"
              maxLength={100000}
            />
          ) : (
            <DropZone label="Upload payload" accept={PAYLOAD_ACCEPT[payloadMode]} file={payloadFile} onFile={handlePayloadFileChange} />
          )}
          <CapacityBar payloadSize={payloadSize} capacity={capacity} loading={capacityLoading} />
        </GlassCard>

        <HideEncryptStep password={password} onChange={setPassword} />

        <button type="submit" disabled={loading} className="btn-primary w-full opacity-0 animate-fade-up delay-4">
          {loading ? "Processing…" : "Hide payload →"}
        </button>
      </form>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
