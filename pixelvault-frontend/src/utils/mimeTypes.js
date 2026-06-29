export const CARRIER_DOCUMENT_ACCEPT =
  ".pdf,.docx,.pptx,.xlsx,.odt,.ods,.odp,.odg,.rtf,.txt,.csv,.md,.html,.htm,.xml";

export const CARRIER_AUDIO_ACCEPT =
  ".mp3,.wav,.flac,.ogg,.m4a,.aac,.wma,.opus,.aiff,.aif,.weba";

export const PAYLOAD_ACCEPT = {
  text: null,
  document: ".pdf,.docx,.pptx,.xlsx,.odt,.ods,.odp,.rtf,.txt,.csv,.md",
  image: ".png,.jpg,.jpeg",
  video: ".mp4",
  audio: CARRIER_AUDIO_ACCEPT,
};

export const CARRIER_TYPES = [
  { id: "image", label: "Image", hint: "PNG · JPG" },
  { id: "video", label: "Video", hint: "MP4" },
  { id: "audio", label: "Audio", hint: "MP3 · WAV · FLAC…" },
  { id: "document", label: "Document", hint: "PDF · Office · ODF" },
];

export const DOCUMENT_FORMATS = [
  "PDF", "DOCX", "PPTX", "XLSX",
  "ODT", "ODS", "ODP", "ODG",
  "RTF", "TXT", "CSV", "MD", "HTML", "XML",
];

export const AUDIO_FORMATS = [
  "MP3", "WAV", "FLAC", "OGG", "M4A", "AAC", "WMA", "OPUS", "AIFF", "WEBA",
];

const MAX_UPLOAD = 500 * 1024 * 1024;
const DOCUMENT_OVERHEAD = 64 * 1024;

export function getPayloadSize(payloadMode, payloadFile, payloadText) {
  if (payloadMode === "text") {
    return new Blob([payloadText || ""]).size;
  }
  return payloadFile?.size || 0;
}

export function estimateDocumentCapacity(file) {
  return Math.max(0, MAX_UPLOAD - file.size - DOCUMENT_OVERHEAD);
}

export function getStegoFilename(carrierType, carrierFile) {
  if (carrierType === "image") return "stego.png";
  if (carrierType === "video") return "stego.mp4";
  const ext = carrierFile?.name.match(/\.[^.]+$/)?.[0] || ".bin";
  return `stego${ext.toLowerCase()}`;
}

const BLOCK = 8;
const KEYFRAME_INTERVAL = 5;

export async function estimateImageCapacity(file, method) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (method === "lsb") {
        const bits = width * height * 3 - 32;
        resolve(Math.floor(bits / 8));
      } else {
        const blocks = Math.floor(height / BLOCK) * Math.floor(width / BLOCK);
        resolve(Math.floor((blocks * 16) / 8));
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve(0);
    img.src = URL.createObjectURL(file);
  });
}

export async function estimateVideoCapacity(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      const fps = 30;
      const frameCount = Math.floor(duration * fps);
      const selected = Math.ceil(frameCount / KEYFRAME_INTERVAL);
      const blocks = Math.floor(video.videoHeight / BLOCK) * Math.floor(video.videoWidth / BLOCK);
      resolve(Math.floor((selected * blocks * 16) / 8));
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
}

export async function estimateCarrierCapacity(carrierType, file, stegoMethod) {
  if (!file) return 0;
  if (carrierType === "image") return estimateImageCapacity(file, stegoMethod);
  if (carrierType === "video") return estimateVideoCapacity(file);
  if (carrierType === "document") return estimateDocumentCapacity(file);
  if (carrierType === "audio") return estimateDocumentCapacity(file);
  return 0;
}
