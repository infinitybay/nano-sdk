import { NonThrowing } from "../types/non-throwing";
import { PredicateResult } from "../types/result";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsEqualToParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsEqualToThrowing(params: RawIsEqualToParams & Throwing): boolean {
  return compareRawValues(params.raw, params.compareTo) === 0;
}

function rawIsEqualToNonThrowing(params: RawIsEqualToParams & NonThrowing): PredicateResult<"checked", "equal"> {
  try {
    return {
      checked: true,
      equal: rawIsEqualToThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      checked: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawIsEqualTo(params: RawIsEqualToParams & NonThrowing): PredicateResult<"checked", "equal">;
export function rawIsEqualTo(params: RawIsEqualToParams & Throwing): boolean;
export function rawIsEqualTo(params: RawIsEqualToParams): PredicateResult<"checked", "equal"> | boolean;
export function rawIsEqualTo(params: RawIsEqualToParams) {
  if (params.throwOnError === false) {
    return rawIsEqualToNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawIsEqualToThrowing({ ...params, throwOnError: true });
  }
}
