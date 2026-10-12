// Reads the payload of a JWT in the browser.
// This does NOT verify the signature - use it only for display (e.g. username).
export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));

    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}