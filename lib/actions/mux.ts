"use server";

import jwt from "jsonwebtoken";
import { formatSigningKey } from "@/lib/mux";

export async function getMuxSignedToken(
  playbackId: string | null | undefined
): Promise<{ token: string | null; error?: string; debug?: string }> {
  const signingKey = process.env.MUX_SIGNING_KEY;
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;

  if (!signingKey || !signingKeyId) {
    return {
      token: null,
      error: "Mux signing keys are not configured",
      debug:
        `Missing: ${!signingKey ? "MUX_SIGNING_KEY" : ""} ${!signingKeyId ? "MUX_SIGNING_KEY_ID" : ""}`.trim(),
    };
  }

  if (!playbackId) {
    return { token: null, error: "playbackId is required" };
  }

  try {
    // Generate a signed token that expires in 1 hour
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const payload = {
      sub: playbackId,
      exp: expirationTime,
      kid: signingKeyId,
      aud: "v" as const,
    };

    // Format the signing key - handles base64-encoded keys from Sanity/env vars
    const formattedKey = formatSigningKey(signingKey);
    const token = jwt.sign(payload, formattedKey, { algorithm: "RS256" });

    return { token };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate signed token";

    return {
      token: null,
      error: errorMessage,
      debug: error instanceof Error ? error.stack : String(error),
    };
  }
}
