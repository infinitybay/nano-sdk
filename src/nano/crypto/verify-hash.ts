import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";
import { hashBlock } from "./hash-block";

type BlockInput = {
  account: AccountString;
  previous: HashString;
  representative: AccountString;
  balance: RawAmountString;
  link: LinkString;
};

export type VerifyHashParams = {
  hash: HashString;
  block: BlockInput;
};

export type VerifyHashResult = PredicateResult<
  "checked",
  "validHash",
  CryptoError<CryptoErrorCode.HashBlockFailed | CryptoErrorCode.InvalidHash | CryptoErrorCode.Unexpected>
>;

export function verifyHash(params: VerifyHashParams & NonThrowing): VerifyHashResult;
export function verifyHash(params: VerifyHashParams & Throwing): boolean;
export function verifyHash(params: VerifyHashParams & (Throwing | NonThrowing)): VerifyHashResult | boolean;
export function verifyHash(params: VerifyHashParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<VerifyHashResult, { checked: false }>["error"]> => {
    try {
      const validatedHash = HashString().safeParse(params.hash);
      if (!validatedHash.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidHash, "Invalid hash value."));
      }

      const blockHash = hashBlock({ block: params.block, throwOnError: false });
      if (!blockHash.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HashBlockFailed, "Failed to hash block.", { cause: blockHash.error })
        );
      }

      return Result.ok(validatedHash.data === blockHash.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, validHash: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
