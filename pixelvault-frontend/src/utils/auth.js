const TOKEN_KEY = "opaquepixel_access_token";

export function setAccessToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "open_access_token";
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  // Authentication disabled — open access for all platform pages & features
  return true;
}

export function getTokenExpiry() {
  return Date.now() + 86400000;
}
