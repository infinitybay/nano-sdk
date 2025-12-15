import { blake2b } from "blakejs";

import { AccountPrefix, AccountString } from "../types/account";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { encodeBase32 } from "./conversion/base32-converter";
import { publicKeyToBytes } from "./conversion/public-key-converter";

type DeriveAccountFromPublicKeyParams = {
  publicKey: PublicKeyString;
  accountPrefix?: AccountPrefix;
} & (Throwing | NonThrowing);

function deriveAccountFromPublicKeyThrowing(params: DeriveAccountFromPublicKeyParams & Throwing): AccountString {
  const validatedPublicKey = PublicKeyString().safeParse(params.publicKey);
  if (!validatedPublicKey.success) {
    throw new Error("Invalid public key value.");
  }

  const accountPrefix = params.accountPrefix ?? "nano_";
  const validatedAccountPrefix = AccountPrefix({ prefix: accountPrefix }).safeParse(accountPrefix);
  if (!validatedAccountPrefix.success) {
    throw new Error("Invalid account prefix value.");
  }

  const publicKeyBytes = publicKeyToBytes({ publicKey: validatedPublicKey.data, throwOnError: true });

  let checksumBytes: Uint8Array;
  try {
    checksumBytes = blake2b(publicKeyBytes, undefined, 5).reverse();
  } catch (_err) {
    throw new Error("Failed to determine checksum bytes.");
  }

  const encodedPublicKey = encodeBase32({ bytes: publicKeyBytes, throwOnError: true });
  const encodedChecksum = encodeBase32({ bytes: checksumBytes, throwOnError: true });

  const accountResult = AccountString().safeParse(validatedAccountPrefix.data + encodedPublicKey + encodedChecksum);
  if (!accountResult.success) {
    throw new Error("Failed to derive account from public key.");
  }

  return accountResult.data;
}

function deriveAccountFromPublicKeyNonThrowing(
  params: DeriveAccountFromPublicKeyParams & NonThrowing
): Result<AccountString> {
  try {
    return {
      success: true,
      data: deriveAccountFromPublicKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function deriveAccountFromPublicKey(
  params: DeriveAccountFromPublicKeyParams & NonThrowing
): Result<AccountString>;
export function deriveAccountFromPublicKey(params: DeriveAccountFromPublicKeyParams & Throwing): AccountString;
export function deriveAccountFromPublicKey(
  params: DeriveAccountFromPublicKeyParams
): AccountString | Result<AccountString>;
export function deriveAccountFromPublicKey(params: DeriveAccountFromPublicKeyParams) {
  if (params.throwOnError === false) {
    return deriveAccountFromPublicKeyNonThrowing({ ...params, throwOnError: false });
  } else {
    return deriveAccountFromPublicKeyThrowing({ ...params, throwOnError: true });
  }
}
