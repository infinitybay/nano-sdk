import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsGreaterThanOrEqualToParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsGreaterThanOrEqualToThrowing(params: RawIsGreaterThanOrEqualToParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) >= 0;
}

function rawIsGreaterThanOrEqualToNonThrowing(
  params: RawIsGreaterThanOrEqualToParams & NonThrowing
): PredicateResult<"checked", "greaterOrEqual"> {
  try {
    return {
      checked: true,
      greaterOrEqual: rawIsGreaterThanOrEqualToThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawIsGreaterThanOrEqualTo(
  params: RawIsGreaterThanOrEqualToParams & NonThrowing
): PredicateResult<"checked", "greaterOrEqual">;
export function rawIsGreaterThanOrEqualTo(params: RawIsGreaterThanOrEqualToParams & Throwing): boolean;
export function rawIsGreaterThanOrEqualTo(
  params: RawIsGreaterThanOrEqualToParams
): PredicateResult<"checked", "greaterOrEqual"> | boolean;
export function rawIsGreaterThanOrEqualTo(params: RawIsGreaterThanOrEqualToParams) {
  if (params.throwOnError === false) {
    return rawIsGreaterThanOrEqualToNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawIsGreaterThanOrEqualToThrowing({ ...params, throwOnError: true });
  }
}
