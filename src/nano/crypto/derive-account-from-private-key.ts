import { AccountString } from "../types/account";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { deriveAccountFromPublicKey } from "./derive-account-from-public-key";
import { derivePublicKeyFromPrivateKey } from "./derive-public-key-from-private-key";

export function deriveAccountFromPrivateKey(privateKey: PrivateKeyString): AccountString {
  const publicKey = derivePublicKeyFromPrivateKey(privateKey);
  return deriveAccountFromPublicKey(publicKey);
}

export function safeDeriveAccountFromPrivateKey(privateKey: PrivateKeyString): Result<AccountString> {
  try {
    return { success: true, data: deriveAccountFromPrivateKey(privateKey) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
