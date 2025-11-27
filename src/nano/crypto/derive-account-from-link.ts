import { AccountString } from "../types/account";
import { LinkString } from "../types/link";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { deriveAccountFromPublicKey } from "./derive-account-from-public-key";

export function deriveAccountFromLink(link: LinkString): AccountString {
  const publicKeyResult = PublicKeyString().safeParse(link);
  if (!publicKeyResult.success) {
    throw new Error("Invalid link: cannot convert to public key.");
  }

  return deriveAccountFromPublicKey(publicKeyResult.data);
}

export function safeDeriveAccountFromLink(link: LinkString): Result<AccountString> {
  try {
    return { success: true, data: deriveAccountFromLink(link) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
