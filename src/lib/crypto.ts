function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Hex(data: ArrayBuffer | Uint8Array) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);

  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes as BufferSource);
    return bytesToHex(new Uint8Array(digest));
  }

  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}
