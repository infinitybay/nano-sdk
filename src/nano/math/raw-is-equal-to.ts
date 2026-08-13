import { RawAmount } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { RawComparisonInputs } from "./comparison";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawIsEqualToParams = RawComparisonInputs;

export type RawIsEqualToResult = PredicateResult<
  "checked",
  "equal",
  MathError<MathErrorCode.InvalidCompareTo | MathErrorCode.InvalidRaw | MathErrorCode.Unexpected>
>;

export function rawIsEqualTo(params: RawIsEqualToParams & NonThrowing): RawIsEqualToResult;
export function rawIsEqualTo(params: RawIsEqualToParams & Throwing): boolean;
export function rawIsEqualTo(params: RawIsEqualToParams & (Throwing | NonThrowing)): RawIsEqualToResult | boolean;
export function rawIsEqualTo(params: RawIsEqualToParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<RawIsEqualToResult, { checked: false }>["error"]> => {
    try {
      const rawResult = RawAmount().safeParse(params.raw);
      if (!rawResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      const compareToResult = RawAmount().safeParse(params.compareTo);
      if (!compareToResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidCompareTo, "Invalid compareTo value."));
      }

      return Result.ok(rawResult.data === compareToResult.data);
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, equal: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
