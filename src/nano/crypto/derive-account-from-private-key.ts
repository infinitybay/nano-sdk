import { AccountString } from "../types/account";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { deriveAccountFromPublicKey } from "./derive-account-from-public-key";
import { derivePublicKeyFromPrivateKey } from "./derive-public-key-from-private-key";

type DeriveAccountFromPrivateKeyParams = {
  privateKey: PrivateKeyString;
} & (Throwing | NonThrowing);

function deriveAccountFromPrivateKeyThrowing(params: DeriveAccountFromPrivateKeyParams & Throwing): AccountString {
  const publicKey = derivePublicKeyFromPrivateKey({ privateKey: params.privateKey, throwOnError: true });
  return deriveAccountFromPublicKey({ publicKey, throwOnError: true });
}

function deriveAccountFromPrivateKeyNonThrowing(
  params: DeriveAccountFromPrivateKeyParams & NonThrowing
): Result<AccountString> {
  try {
    return {
      success: true,
      data: deriveAccountFromPrivateKeyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function deriveAccountFromPrivateKey(
  params: DeriveAccountFromPrivateKeyParams & NonThrowing
): Result<AccountString>;
export function deriveAccountFromPrivateKey(params: DeriveAccountFromPrivateKeyParams & Throwing): AccountString;
export function deriveAccountFromPrivateKey(
  params: DeriveAccountFromPrivateKeyParams
): AccountString | Result<AccountString>;
export function deriveAccountFromPrivateKey(params: DeriveAccountFromPrivateKeyParams) {
  if (params.throwOnError === false) {
    return deriveAccountFromPrivateKeyNonThrowing({ ...params, throwOnError: false });
  } else {
    return deriveAccountFromPrivateKeyThrowing({ ...params, throwOnError: true });
  }
}
