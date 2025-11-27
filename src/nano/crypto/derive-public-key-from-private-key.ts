import { Nacl } from "../types/nacl";
import { PrivateKeyString } from "../types/private-key";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { privateKeyToBytes } from "./conversion/private-key-converter";
import { bytesToPublicKey } from "./conversion/public-key-converter";

export function derivePublicKeyFromPrivateKey(privateKey: PrivateKeyString): PublicKeyString {
  const validatedPrivateKey = PrivateKeyString().safeParse(privateKey);
  if (!validatedPrivateKey.success) {
    throw new Error("Invalid private key value.");
  }

  const privateKeyBytes = privateKeyToBytes(validatedPrivateKey.data);

  try {
    return bytesToPublicKey(Nacl.derivePublicFromSecret(privateKeyBytes));
  } catch (_err) {
    throw new Error("Failed to derive public key from private key.");
  }
}

export function safeDerivePublicKeyFromPrivateKey(privateKey: PrivateKeyString): Result<PublicKeyString> {
  try {
    return { success: true, data: derivePublicKeyFromPrivateKey(privateKey) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
