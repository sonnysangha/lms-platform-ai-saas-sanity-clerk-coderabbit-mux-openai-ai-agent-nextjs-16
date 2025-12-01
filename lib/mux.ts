/**
 * Formats a signing key for JWT signing.
 * Handles base64-encoded keys and ensures PEM format.
 */
export function formatSigningKey(key: string): string {
  // If already in PEM format, return as-is
  if (key.includes("-----BEGIN")) {
    return key;
  }

  try {
    // Try to decode base64 to get PEM-formatted key
    const decodedKey = Buffer.from(key, "base64").toString("utf-8");

    if (decodedKey.includes("-----BEGIN")) {
      // Successfully decoded to PEM format
      return decodedKey;
    }

    // If decoded but not PEM, wrap it in PEM headers
    return `-----BEGIN PRIVATE KEY-----\n${decodedKey.match(/.{1,64}/g)?.join("\n") || decodedKey}\n-----END PRIVATE KEY-----`;
  } catch {
    // If base64 decode fails, wrap the original key
    return `-----BEGIN PRIVATE KEY-----\n${key.match(/.{1,64}/g)?.join("\n") || key}\n-----END PRIVATE KEY-----`;
  }
}
