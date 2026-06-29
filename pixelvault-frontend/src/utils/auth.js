const TOKEN_KEY = "opaquepixel_access_token";

function decodeTokenPayload(token) {
  try {
    const [msg] = token.split(".");
    if (!msg) return null;
    let b64 = msg.replace(/-/g, "+").replace(/_/g, "/");
    b64 += "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export function setAccessToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  const token = getAccessToken();
  if (!token) return false;
  const payload = decodeTokenPayload(token);
  if (!payload || payload.app !== "opaquepixel" || !payload.jti) {
    clearAccessToken();
    return false;
  }
  if (!payload.exp || payload.exp * 1000 <= Date.now()) {
    clearAccessToken();
    return false;
  }
  return true;
}

export function getTokenExpiry() {
  const payload = decodeTokenPayload(getAccessToken() || "");
  return payload?.exp ? payload.exp * 1000 : null;
}
