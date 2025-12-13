import { NonThrowing } from "../types/non-throwing";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsGreaterThanParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsGreaterThanThrowing(params: RawIsGreaterThanParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) > 0;
}

function rawIsGreaterThanNonThrowing(params: RawIsGreaterThanParams & NonThrowing): boolean {
  try {
    return rawIsGreaterThanThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function rawIsGreaterThan(params: RawIsGreaterThanParams & NonThrowing): boolean;
export function rawIsGreaterThan(params: RawIsGreaterThanParams & Throwing): boolean;
export function rawIsGreaterThan(params: RawIsGreaterThanParams): boolean;
export function rawIsGreaterThan(params: RawIsGreaterThanParams) {
  if (params.throwOnError === true) {
    return rawIsGreaterThanThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsGreaterThanNonThrowing({ ...params, throwOnError: false });
  }
}
