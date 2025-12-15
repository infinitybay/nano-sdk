import { RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";

type RawIsZeroParams = {
  raw: RawAmountString;
} & (Throwing | NonThrowing);

function rawIsZeroThrowing(params: RawIsZeroParams & Throwing): boolean {
  const rawResult = RawAmountString().safeParse(params.raw);
  if (!rawResult.success) {
    throw new Error("Invalid raw value.");
  }
  return BigInt(rawResult.data) === 0n;
}

function rawIsZeroNonThrowing(params: RawIsZeroParams & NonThrowing): PredicateResult<"checked", "zero"> {
  try {
    return {
      checked: true,
      zero: rawIsZeroThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawIsZero(params: RawIsZeroParams & NonThrowing): PredicateResult<"checked", "zero">;
export function rawIsZero(params: RawIsZeroParams & Throwing): boolean;
export function rawIsZero(params: RawIsZeroParams): PredicateResult<"checked", "zero"> | boolean;
export function rawIsZero(params: RawIsZeroParams) {
  if (params.throwOnError === false) {
    return rawIsZeroNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawIsZeroThrowing({ ...params, throwOnError: true });
  }
}
