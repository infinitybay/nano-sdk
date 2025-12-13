import { NonThrowing } from "../types/non-throwing";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsGreaterThanOrEqualToParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsGreaterThanOrEqualToThrowing(params: RawIsGreaterThanOrEqualToParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) >= 0;
}

function rawIsGreaterThanOrEqualToNonThrowing(params: RawIsGreaterThanOrEqualToParams & NonThrowing): boolean {
  try {
    return rawIsGreaterThanOrEqualToThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function rawIsGreaterThanOrEqualTo(params: RawIsGreaterThanOrEqualToParams & NonThrowing): boolean;
export function rawIsGreaterThanOrEqualTo(params: RawIsGreaterThanOrEqualToParams & Throwing): boolean;
export function rawIsGreaterThanOrEqualTo(params: RawIsGreaterThanOrEqualToParams): boolean;
export function rawIsGreaterThanOrEqualTo(params: RawIsGreaterThanOrEqualToParams) {
  if (params.throwOnError === true) {
    return rawIsGreaterThanOrEqualToThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsGreaterThanOrEqualToNonThrowing({ ...params, throwOnError: false });
  }
}
