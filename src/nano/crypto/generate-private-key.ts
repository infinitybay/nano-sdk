import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { generateSeed } from "./generate-seed";

export function generatePrivateKey(): PrivateKeyString {
  const privateKeyResult = PrivateKeyString().safeParse(generateSeed());
  if (!privateKeyResult.success) {
    throw new Error("Generated private key is invalid.");
  }
  return privateKeyResult.data;
}

export function safeGeneratePrivateKey(): Result<PrivateKeyString> {
  try {
    return { success: true, data: generatePrivateKey() };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
