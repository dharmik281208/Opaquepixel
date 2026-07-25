import { useState, useEffect } from "react";
import DropZone from "../components/DropZone";
import Toast from "../components/Toast";
import CapacityBar from "../components/CapacityBar";
import ResultCard from "../components/ResultCard";
import { PixelEmbedGrid } from "../components/ui/StegoVisuals";
import {
  Panel,
  SectionHeader,
  OptionGroup,
  PasswordField,
  PrimaryButton,
  WhatsAppWarning,
  Chip,
  CARRIERS,
  ALGORITHMS,
} from "../components/ui/ToolPrimitives";
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

const PAYLOADS = [
  { value: "text", label: "Text" },
  { value: "doc", label: "Doc" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
];

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
    if (e) e.preventDefault();
    if (!carrier) return setToast({ message: "Please upload a carrier file", type: "error" });
    const pwdError = validatePassword(password);
    if (pwdError) return setToast({ message: pwdError, type: "error" });
    if (payloadMode === "text" && !payloadText.trim())
      return setToast({ message: "Please enter a secret message", type: "error" });
    if (payloadMode !== "text" && !payloadFile)
      return setToast({ message: "Please upload a payload file", type: "error" });

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
      setToast({ message: "Payload successfully hidden into carrier file!", type: "success" });
    } catch (err) {
      let msg = "Failed to embed payload";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed.detail) msg = parsed.detail;
        } catch {
          /* ignore */
        }
      } else if (err.response?.data?.detail) {
        msg = err.response.data.detail;
      }
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--orchid)]">
            Hide
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl font-display font-semibold text-[color:var(--ink)]">
            Encrypt &amp; embed a payload
          </h1>
          <p className="mt-2 text-[color:var(--slate)]">
            Choose a carrier, drop your payload, seal it with AES-256-GCM.
          </p>
        </header>

        <div className="mb-8">
          <PixelEmbedGrid seed="hide" />
        </div>

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
                label="Upload carrier"
                hint={carrierHint}
                accept={carrierAccept}
                file={carrier}
                onFile={setCarrier}
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
            <SectionHeader step="Step 02" title="Payload" />
            <OptionGroup
              label="Payload type"
              value={payloadMode}
              onChange={(v) => {
                setPayloadMode(v);
                setPayloadFile(null);
                setPayloadText("");
              }}
              options={PAYLOADS}
            />

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip tone="accent">Algorithm · AES-256-GCM</Chip>
              <Chip tone="accent">KDF · PBKDF2 · 600k</Chip>
              <Chip tone="accent">Mode · Authenticated</Chip>
            </div>

            {payloadMode === "text" ? (
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)]">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  placeholder="Type the secret to hide…"
                  className="mt-2 w-full resize-none rounded-xl border border-[color:var(--input)] bg-[color:var(--card)] px-4 py-3 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--orchid)] focus:ring-4 focus:ring-[color:color-mix(in_oklab,var(--lilac)_25%,transparent)]"
                />
              </div>
            ) : (
              <div className="mt-6">
                <DropZone
                  label="Upload payload file"
                  accept={PAYLOAD_ACCEPT[payloadMode]}
                  file={payloadFile}
                  onFile={setPayloadFile}
                />
              </div>
            )}

            {carrier && (
              <div className="mt-6">
                <CapacityBar
                  capacity={capacity}
                  used={payloadSize}
                  loading={capacityLoading}
                />
              </div>
            )}

            <div className="mt-6">
              <PasswordField
                label="Encryption password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Protected"
              />
              <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-[color:var(--slate)]">
                <li>• At least 8 characters</li>
                <li>• 1 uppercase letter (A-Z)</li>
                <li>• 1 lowercase letter (a-z)</li>
                <li>• 1 number (0-9)</li>
                <li>• 1 special character (!@#…)</li>
              </ul>
              <p className="mt-3 text-xs text-[color:var(--slate)]">
                Use a unique password. It is never stored — if you lose it, the hidden data cannot be recovered.
              </p>
            </div>
          </Panel>

          {result && (
            <ResultCard
              title="Stego carrier generated successfully!"
              blob={result.blob}
              filename={result.filename}
              onReset={() => {
                setResult(null);
                setCarrier(null);
                setPayloadFile(null);
                setPayloadText("");
                setPassword("");
              }}
            />
          )}

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Encrypting & Embedding…" : "Hide payload"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
