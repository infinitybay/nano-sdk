import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { hashToBytes } from "./conversion/hash-converter";
import { privateKeyToBytes } from "./conversion/private-key-converter";
import { bytesToSignature } from "./conversion/signature-converter";

type SignHashInput = {
  hash: HashString;
  privateKey: PrivateKeyString;
};

export function signHash(input: SignHashInput): SignatureString {
  const hashBytes = hashToBytes(input.hash);
  const privateKeyBytes = privateKeyToBytes(input.privateKey);

  try {
    const signatureBytes = Nacl.signDetached(hashBytes, privateKeyBytes);
    return bytesToSignature(signatureBytes);
  } catch (_err) {
    throw new Error("Failed to create a valid signature.");
  }
}

export function safeSignHash(input: SignHashInput): Result<SignatureString> {
  try {
    return { success: true, data: signHash(input) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
