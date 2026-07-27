import { AccountString } from "../types/account";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { accountToBytes } from "./conversion/account-converter";
import { bytesToPublicKey } from "./conversion/public-key-converter";

type DerivePublicKeyFromAccountParams = {
  account: AccountString;
} & (Throwing | NonThrowing);

function derivePublicKeyFromAccountThrowing(params: DerivePublicKeyFromAccountParams & Throwing): PublicKeyString {
  const validatedAccount = AccountString().safeParse(params.account);
  if (!validatedAccount.success) {
    throw new Error("Invalid account value.");
  }

  const publicKeyBytes = accountToBytes({ account: validatedAccount.data, throwOnError: true });

  try {
    return bytesToPublicKey({ publicKeyBytes, throwOnError: true });
  } catch (err) {
    throw new Error("Failed to derive public key from account.", { cause: err });
  }
}

function derivePublicKeyFromAccountNonThrowing(
  params: DerivePublicKeyFromAccountParams & NonThrowing
): Result<PublicKeyString> {
  try {
    return {
      success: true,
      data: derivePublicKeyFromAccountThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function derivePublicKeyFromAccount(
  params: DerivePublicKeyFromAccountParams & NonThrowing
): Result<PublicKeyString>;
export function derivePublicKeyFromAccount(params: DerivePublicKeyFromAccountParams & Throwing): PublicKeyString;
export function derivePublicKeyFromAccount(
  params: DerivePublicKeyFromAccountParams
): PublicKeyString | Result<PublicKeyString>;
export function derivePublicKeyFromAccount(params: DerivePublicKeyFromAccountParams) {
  if (params.throwOnError === false) {
    return derivePublicKeyFromAccountNonThrowing({ ...params, throwOnError: false });
  } else {
    return derivePublicKeyFromAccountThrowing({ ...params, throwOnError: true });
  }
}
