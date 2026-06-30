import axios from "axios";
import { getAccessToken, clearAccessToken } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://opaquepixel-api.onrender.com/api",
  timeout: 120000,
});

API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAccessToken();
    }
    return Promise.reject(err);
  }
);

export async function hidePayload({
  carrier,
  payload,
  payloadText,
  payloadType,
  password,
  carrierType,
  stegoMethod = "dst",
}) {
  const form = new FormData();
  form.append("carrier", carrier);
  form.append("payload_type", payloadType);
  form.append("password", password);
  form.append("carrier_type", carrierType);

  if (carrierType === "image") {
    form.append("stego_method", stegoMethod);
  }

  if (payloadType === "text") {
    form.append("payload_text", payloadText);
  } else if (payload) {
    form.append("payload", payload);
  }

  const res = await API.post("/hide", form, { responseType: "blob" });
  return res.data;
}

export async function revealPayload({ carrier, password, carrierType, stegoMethod }) {
  const form = new FormData();
  form.append("carrier", carrier);
  form.append("password", password);
  form.append("carrier_type", carrierType);
  if (stegoMethod) form.append("stego_method", stegoMethod);

  const res = await API.post("/reveal", form);
  return res.data;
}

export async function scanCarrier({ carrier, carrierType, stegoMethod }) {
  const form = new FormData();
  form.append("carrier", carrier);
  form.append("carrier_type", carrierType);
  if (stegoMethod) form.append("stego_method", stegoMethod);

  const res = await API.post("/scan", form);
  return res.data;
}

export async function checkHealth() {
  const res = await API.get("/health");
  return res.data;
}
