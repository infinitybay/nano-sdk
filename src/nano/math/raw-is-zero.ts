import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawIsZeroParams = {
  raw: RawAmount | RawAmountString;
};

export type RawIsZeroResult = PredicateResult<
  "checked",
  "zero",
  MathError<MathErrorCode.InvalidRaw | MathErrorCode.Unexpected>
>;

export function rawIsZero(params: RawIsZeroParams & NonThrowing): RawIsZeroResult;
export function rawIsZero(params: RawIsZeroParams & Throwing): boolean;
export function rawIsZero(params: RawIsZeroParams & (Throwing | NonThrowing)): RawIsZeroResult | boolean;
export function rawIsZero(params: RawIsZeroParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<RawIsZeroResult, { checked: false }>["error"]> => {
    try {
      const rawResult = RawAmount().safeParse(params.raw);
      if (!rawResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }
      return Result.ok(rawResult.data === 0n);
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, zero: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
