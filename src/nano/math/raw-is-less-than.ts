import { RawAmount } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { PredicateResult, Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { RawComparisonInputs } from "./comparison";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawIsLessThanParams = RawComparisonInputs;

export type RawIsLessThanResult = PredicateResult<
  "checked",
  "less",
  MathError<MathErrorCode.InvalidCompareTo | MathErrorCode.InvalidRaw | MathErrorCode.Unexpected>
>;

export function rawIsLessThan(params: RawIsLessThanParams & NonThrowing): RawIsLessThanResult;
export function rawIsLessThan(params: RawIsLessThanParams & Throwing): boolean;
export function rawIsLessThan(params: RawIsLessThanParams & (Throwing | NonThrowing)): RawIsLessThanResult | boolean;
export function rawIsLessThan(params: RawIsLessThanParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<RawIsLessThanResult, { checked: false }>["error"]> => {
    try {
      const rawResult = RawAmount().safeParse(params.raw);
      if (!rawResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      const compareToResult = RawAmount().safeParse(params.compareTo);
      if (!compareToResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidCompareTo, "Invalid compareTo value."));
      }

      return Result.ok(rawResult.data < compareToResult.data);
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, less: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
