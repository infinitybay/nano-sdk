import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { derivePublicKeyFromPrivateKey } from "./derive-public-key-from-private-key";
import { generatePrivateKey } from "./generate-private-key";

export function generatePublicKey(): PublicKeyString {
  const privateKey = generatePrivateKey();
  return derivePublicKeyFromPrivateKey(privateKey);
}

export function safeGeneratePublicKey(): Result<PublicKeyString> {
  try {
    return { success: true, data: generatePublicKey() };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
