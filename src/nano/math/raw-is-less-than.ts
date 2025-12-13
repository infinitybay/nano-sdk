import { NonThrowing } from "../types/non-throwing";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsLessThanParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsLessThanThrowing(params: RawIsLessThanParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) < 0;
}

function rawIsLessThanNonThrowing(params: RawIsLessThanParams & NonThrowing): boolean {
  try {
    return rawIsLessThanThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function rawIsLessThan(params: RawIsLessThanParams & NonThrowing): boolean;
export function rawIsLessThan(params: RawIsLessThanParams & Throwing): boolean;
export function rawIsLessThan(params: RawIsLessThanParams): boolean;
export function rawIsLessThan(params: RawIsLessThanParams) {
  if (params.throwOnError === true) {
    return rawIsLessThanThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsLessThanNonThrowing({ ...params, throwOnError: false });
  }
}
