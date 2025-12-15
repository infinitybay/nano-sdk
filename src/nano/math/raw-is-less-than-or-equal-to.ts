import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsLessThanOrEqualToParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsLessThanOrEqualToThrowing(params: RawIsLessThanOrEqualToParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) <= 0;
}

function rawIsLessThanOrEqualToNonThrowing(
  params: RawIsLessThanOrEqualToParams & NonThrowing
): PredicateResult<"checked", "lessOrEqual"> {
  try {
    return {
      checked: true,
      lessOrEqual: rawIsLessThanOrEqualToThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawIsLessThanOrEqualTo(
  params: RawIsLessThanOrEqualToParams & NonThrowing
): PredicateResult<"checked", "lessOrEqual">;
export function rawIsLessThanOrEqualTo(params: RawIsLessThanOrEqualToParams & Throwing): boolean;
export function rawIsLessThanOrEqualTo(
  params: RawIsLessThanOrEqualToParams
): PredicateResult<"checked", "lessOrEqual"> | boolean;
export function rawIsLessThanOrEqualTo(params: RawIsLessThanOrEqualToParams) {
  if (params.throwOnError === true) {
    return rawIsLessThanOrEqualToThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsLessThanOrEqualToNonThrowing({ ...params, throwOnError: false });
  }
}
