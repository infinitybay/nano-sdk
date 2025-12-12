import { AccountString } from "../../types/account";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { deriveAccountFromPublicKey } from "../derive-account-from-public-key";
import { decodeBase32 } from "./base32-converter";
import { bytesToPublicKey } from "./public-key-converter";

const encodedPublicKeyLength = 52;
const encodedChecksumLength = 8;

type AccountToBytesParams = {
  account: AccountString;
} & (Throwing | NonThrowing);

function accountToBytesThrowing(params: AccountToBytesParams & Throwing): Uint8Array {
  const validatedAccount = AccountString().safeParse(params.account);
  if (!validatedAccount.success) {
    throw new Error("Invalid account.");
  }

  const publicKeyStartIndex = validatedAccount.data.length - encodedPublicKeyLength - encodedChecksumLength;
  const publicKeyEndIndex = validatedAccount.data.length - encodedChecksumLength;
  const encodedPublicKey = validatedAccount.data.substring(publicKeyStartIndex, publicKeyEndIndex);
  return decodeBase32({ encoded: encodedPublicKey, throwOnError: true });
}

function accountToBytesNonThrowing(params: AccountToBytesParams & NonThrowing): Result<Uint8Array> {
  try {
    return {
      success: true,
      data: accountToBytesThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function accountToBytes(params: AccountToBytesParams & NonThrowing): Result<Uint8Array>;
export function accountToBytes(params: AccountToBytesParams & Throwing): Uint8Array;
export function accountToBytes(params: AccountToBytesParams): Uint8Array | Result<Uint8Array>;
export function accountToBytes(params: AccountToBytesParams) {
  if (params.throwOnError === true) {
    return accountToBytesThrowing({ ...params, throwOnError: true });
  } else {
    return accountToBytesNonThrowing({ ...params, throwOnError: false });
  }
}

type BytesToAccountParams = {
  publicKeyBytes: Uint8Array;
} & (Throwing | NonThrowing);

function bytesToAccountThrowing(params: BytesToAccountParams & Throwing): AccountString {
  const publicKey = bytesToPublicKey({ publicKeyBytes: params.publicKeyBytes, throwOnError: true });
  return deriveAccountFromPublicKey({ publicKey, throwOnError: true });
}

function bytesToAccountNonThrowing(params: BytesToAccountParams & NonThrowing): Result<AccountString> {
  try {
    return {
      success: true,
      data: bytesToAccountThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function bytesToAccount(params: BytesToAccountParams & NonThrowing): Result<AccountString>;
export function bytesToAccount(params: BytesToAccountParams & Throwing): AccountString;
export function bytesToAccount(params: BytesToAccountParams): AccountString | Result<AccountString>;
export function bytesToAccount(params: BytesToAccountParams) {
  if (params.throwOnError === true) {
    return bytesToAccountThrowing({ ...params, throwOnError: true });
  } else {
    return bytesToAccountNonThrowing({ ...params, throwOnError: false });
  }
}
