import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { hashToBytes } from "./conversion/hash-converter";
import { publicKeyToBytes } from "./conversion/public-key-converter";
import { signatureToBytes } from "./conversion/signature-converter";

type VerifySignatureInput = {
  hash: HashString;
  publicKey: PublicKeyString;
  signature: SignatureString;
};

export function verifySignature(input: VerifySignatureInput): boolean {
  const hashBytes = hashToBytes(input.hash);
  const publicKeyBytes = publicKeyToBytes(input.publicKey);
  const signatureBytes = signatureToBytes(input.signature);

  try {
    return Nacl.verifyDetached(hashBytes, signatureBytes, publicKeyBytes);
  } catch (_err) {
    throw new Error("Failed to verify signature.");
  }
}

export function safeVerifySignature(input: VerifySignatureInput): Result<boolean> {
  try {
    return { success: true, data: verifySignature(input) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
