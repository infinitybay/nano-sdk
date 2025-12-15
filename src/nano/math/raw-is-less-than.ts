import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsLessThanParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsLessThanThrowing(params: RawIsLessThanParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) < 0;
}

function rawIsLessThanNonThrowing(params: RawIsLessThanParams & NonThrowing): PredicateResult<"checked", "less"> {
  try {
    return {
      checked: true,
      less: rawIsLessThanThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawIsLessThan(params: RawIsLessThanParams & NonThrowing): PredicateResult<"checked", "less">;
export function rawIsLessThan(params: RawIsLessThanParams & Throwing): boolean;
export function rawIsLessThan(params: RawIsLessThanParams): PredicateResult<"checked", "less"> | boolean;
export function rawIsLessThan(params: RawIsLessThanParams) {
  if (params.throwOnError === false) {
    return rawIsLessThanNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawIsLessThanThrowing({ ...params, throwOnError: true });
  }
}
