import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsGreaterThanParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsGreaterThanThrowing(params: RawIsGreaterThanParams & Throwing): boolean {
  return compareRawValues(params.raw, params.compareTo) > 0;
}

function rawIsGreaterThanNonThrowing(
  params: RawIsGreaterThanParams & NonThrowing
): PredicateResult<"checked", "greater"> {
  try {
    return {
      checked: true,
      greater: rawIsGreaterThanThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawIsGreaterThan(params: RawIsGreaterThanParams & NonThrowing): PredicateResult<"checked", "greater">;
export function rawIsGreaterThan(params: RawIsGreaterThanParams & Throwing): boolean;
export function rawIsGreaterThan(params: RawIsGreaterThanParams): PredicateResult<"checked", "greater"> | boolean;
export function rawIsGreaterThan(params: RawIsGreaterThanParams) {
  if (params.throwOnError === false) {
    return rawIsGreaterThanNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawIsGreaterThanThrowing({ ...params, throwOnError: true });
  }
}
