import { NonThrowing } from "../types/non-throwing";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsLessThanOrEqualToParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsLessThanOrEqualToThrowing(params: RawIsLessThanOrEqualToParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) <= 0;
}

function rawIsLessThanOrEqualToNonThrowing(params: RawIsLessThanOrEqualToParams & NonThrowing): boolean {
  try {
    return rawIsLessThanOrEqualToThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function rawIsLessThanOrEqualTo(params: RawIsLessThanOrEqualToParams & NonThrowing): boolean;
export function rawIsLessThanOrEqualTo(params: RawIsLessThanOrEqualToParams & Throwing): boolean;
export function rawIsLessThanOrEqualTo(params: RawIsLessThanOrEqualToParams): boolean;
export function rawIsLessThanOrEqualTo(params: RawIsLessThanOrEqualToParams) {
  if (params.throwOnError === true) {
    return rawIsLessThanOrEqualToThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsLessThanOrEqualToNonThrowing({ ...params, throwOnError: false });
  }
}
