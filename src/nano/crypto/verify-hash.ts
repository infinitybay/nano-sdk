import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { hashBlock } from "./hash-block";

type BlockInput = {
  account: AccountString;
  previous: HashString;
  representative: AccountString;
  balance: RawAmountString;
  link: LinkString;
};

type VerifyHashParams = {
  hash: HashString;
  block: BlockInput;
} & (Throwing | NonThrowing);

function verifyHashThrowing(params: VerifyHashParams & Throwing): boolean {
  const validatedHash = HashString().safeParse(params.hash);
  if (!validatedHash.success) {
    throw new Error("Invalid hash value.");
  }

  const blockHash = hashBlock({ ...params.block, throwOnError: true });
  return validatedHash.data === blockHash;
}

function verifyHashNonThrowing(params: VerifyHashParams & NonThrowing): PredicateResult<"checked", "validHash"> {
  try {
    return {
      checked: true,
      validHash: verifyHashThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function verifyHash(params: VerifyHashParams & NonThrowing): PredicateResult<"checked", "validHash">;
export function verifyHash(params: VerifyHashParams & Throwing): boolean;
export function verifyHash(params: VerifyHashParams): PredicateResult<"checked", "validHash"> | boolean;
export function verifyHash(params: VerifyHashParams) {
  if (params.throwOnError === false) {
    return verifyHashNonThrowing({ ...params, throwOnError: false });
  } else {
    return verifyHashThrowing({ ...params, throwOnError: true });
  }
}
