import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
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

function verifyHashNonThrowing(params: VerifyHashParams & NonThrowing): boolean {
  try {
    return verifyHashThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function verifyHash(params: VerifyHashParams & NonThrowing): boolean;
export function verifyHash(params: VerifyHashParams & Throwing): boolean;
export function verifyHash(params: VerifyHashParams): boolean;
export function verifyHash(params: VerifyHashParams) {
  if (params.throwOnError === true) {
    return verifyHashThrowing({ ...params, throwOnError: true });
  } else {
    return verifyHashNonThrowing({ ...params, throwOnError: false });
  }
}
