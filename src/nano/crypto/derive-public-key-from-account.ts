import { AccountString } from "../types/account";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { accountToBytes } from "./conversion/account-converter";
import { bytesToPublicKey } from "./conversion/public-key-converter";

export function derivePublicKeyFromAccount(account: AccountString): PublicKeyString {
  const validatedAccount = AccountString().safeParse(account);
  if (!validatedAccount.success) {
    throw new Error("Invalid account value.");
  }

  const publicKeyBytes = accountToBytes(validatedAccount.data);

  try {
    return bytesToPublicKey(publicKeyBytes);
  } catch (_err) {
    throw new Error("Failed to derive public key from account.");
  }
}

export function safeDerivePublicKeyFromAccount(account: AccountString): Result<PublicKeyString> {
  try {
    return { success: true, data: derivePublicKeyFromAccount(account) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
