import { blake2b } from "blakejs";

import { AccountPrefix, AccountString } from "../types/account";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { encodeBase32 } from "./conversion/base32-converter";
import { publicKeyToBytes } from "./conversion/public-key-converter";

export function deriveAccountFromPublicKey(
  publicKey: PublicKeyString,
  accountPrefix: AccountPrefix = "nano_"
): AccountString {
  const validatedPublicKey = PublicKeyString().safeParse(publicKey);
  if (!validatedPublicKey.success) {
    throw new Error("Invalid public key value.");
  }

  const validatedAccountPrefix = AccountPrefix({ prefix: accountPrefix }).safeParse(accountPrefix);
  if (!validatedAccountPrefix.success) {
    throw new Error("Invalid account prefix value.");
  }

  const publicKeyBytes = publicKeyToBytes(validatedPublicKey.data);

  let checksumBytes: Uint8Array;
  try {
    checksumBytes = blake2b(publicKeyBytes, undefined, 5).reverse();
  } catch (_err) {
    throw new Error("Failed to determine checksum bytes.");
  }

  const encodedPublicKey = encodeBase32(publicKeyBytes);
  const encodedChecksum = encodeBase32(checksumBytes);

  const accountResult = AccountString().safeParse(validatedAccountPrefix.data + encodedPublicKey + encodedChecksum);
  if (!accountResult.success) {
    throw new Error("Failed to derive account from public key.");
  }

  return accountResult.data;
}

export function safeDeriveAccountFromPublicKey(
  publicKey: PublicKeyString,
  accountPrefix: AccountPrefix = "nano_"
): Result<AccountString> {
  try {
    return { success: true, data: deriveAccountFromPublicKey(publicKey, accountPrefix) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
