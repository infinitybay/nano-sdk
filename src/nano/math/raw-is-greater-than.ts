import { RawAmount } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { RawComparisonInputs } from "./comparison";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawIsGreaterThanParams = RawComparisonInputs;

export type RawIsGreaterThanResult = PredicateResult<
  "checked",
  "greater",
  MathError<MathErrorCode.InvalidCompareTo | MathErrorCode.InvalidRaw | MathErrorCode.Unexpected>
>;

export function rawIsGreaterThan(params: RawIsGreaterThanParams & NonThrowing): RawIsGreaterThanResult;
export function rawIsGreaterThan(params: RawIsGreaterThanParams & Throwing): boolean;
export function rawIsGreaterThan(
  params: RawIsGreaterThanParams & (Throwing | NonThrowing)
): RawIsGreaterThanResult | boolean;
export function rawIsGreaterThan(params: RawIsGreaterThanParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<RawIsGreaterThanResult, { checked: false }>["error"]> => {
    try {
      const rawResult = RawAmount().safeParse(params.raw);
      if (!rawResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      const compareToResult = RawAmount().safeParse(params.compareTo);
      if (!compareToResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidCompareTo, "Invalid compareTo value."));
      }

      return Result.ok(rawResult.data > compareToResult.data);
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, greater: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
