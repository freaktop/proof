import { sha256Hex } from "./crypto";

export async function getDeviceFingerprint() {
  if (typeof window === "undefined") {
    return "server";
  }

  const timezoneOffset = new Date().getTimezoneOffset();
  const payload = [
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    String(timezoneOffset),
  ].join("|");

  const encoded = new TextEncoder().encode(payload);
  return sha256Hex(encoded);
}
