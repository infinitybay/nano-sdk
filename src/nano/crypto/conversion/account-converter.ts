import { AccountString } from "../../types/account";
import { Result } from "../../types/result";
import { deriveAccountFromPublicKey } from "../derive-account-from-public-key";
import { decodeBase32 } from "./base32-converter";
import { bytesToPublicKey } from "./public-key-converter";

const encodedPublicKeyLength = 52;
const encodedChecksumLength = 8;

export function accountToBytes(account: AccountString): Uint8Array {
  const validatedAccount = AccountString().safeParse(account);
  if (!validatedAccount.success) {
    throw new Error("Invalid account.");
  }

  const publicKeyStartIndex = validatedAccount.data.length - encodedPublicKeyLength - encodedChecksumLength;
  const publicKeyEndIndex = validatedAccount.data.length - encodedChecksumLength;
  const encodedPublicKey = validatedAccount.data.substring(publicKeyStartIndex, publicKeyEndIndex);
  return decodeBase32(encodedPublicKey);
}

export function safeAccountToBytes(account: AccountString): Result<Uint8Array> {
  try {
    return { success: true, data: accountToBytes(account) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}

export function bytesToAccount(publicKeyBytes: Uint8Array): AccountString {
  const publicKey = bytesToPublicKey(publicKeyBytes);
  return deriveAccountFromPublicKey(publicKey);
}

export function safeBytesToAccount(publicKeyBytes: Uint8Array): Result<AccountString> {
  try {
    return { success: true, data: bytesToAccount(publicKeyBytes) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
