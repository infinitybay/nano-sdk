import { AccountString } from "../types/account";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { deriveAccountFromPublicKey } from "./derive-account-from-public-key";

type DeriveAccountFromLinkParams = {
  link: LinkString;
} & (Throwing | NonThrowing);

function deriveAccountFromLinkThrowing(params: DeriveAccountFromLinkParams & Throwing): AccountString {
  const publicKeyResult = PublicKeyString().safeParse(params.link);
  if (!publicKeyResult.success) {
    throw new Error("Invalid link: cannot convert to public key.");
  }

  return deriveAccountFromPublicKey({ publicKey: publicKeyResult.data, throwOnError: true });
}

function deriveAccountFromLinkNonThrowing(params: DeriveAccountFromLinkParams & NonThrowing): Result<AccountString> {
  try {
    return {
      success: true,
      data: deriveAccountFromLinkThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function deriveAccountFromLink(params: DeriveAccountFromLinkParams & NonThrowing): Result<AccountString>;
export function deriveAccountFromLink(params: DeriveAccountFromLinkParams & Throwing): AccountString;
export function deriveAccountFromLink(params: DeriveAccountFromLinkParams): AccountString | Result<AccountString>;
export function deriveAccountFromLink(params: DeriveAccountFromLinkParams) {
  if (params.throwOnError === false) {
    return deriveAccountFromLinkNonThrowing({ ...params, throwOnError: false });
  } else {
    return deriveAccountFromLinkThrowing({ ...params, throwOnError: true });
  }
}
