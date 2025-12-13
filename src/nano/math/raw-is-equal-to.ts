import { NonThrowing } from "../types/non-throwing";
import { Throwing } from "../types/throwing";
import { compareRawValues, RawComparisonInputs } from "./comparison";

type RawIsEqualToParams = RawComparisonInputs & (Throwing | NonThrowing);

function rawIsEqualToThrowing(params: RawIsEqualToParams & Throwing): boolean {
  return compareRawValues(params.left, params.right) === 0;
}

function rawIsEqualToNonThrowing(params: RawIsEqualToParams & NonThrowing): boolean {
  try {
    return rawIsEqualToThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function rawIsEqualTo(params: RawIsEqualToParams & NonThrowing): boolean;
export function rawIsEqualTo(params: RawIsEqualToParams & Throwing): boolean;
export function rawIsEqualTo(params: RawIsEqualToParams): boolean;
export function rawIsEqualTo(params: RawIsEqualToParams) {
  if (params.throwOnError === true) {
    return rawIsEqualToThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsEqualToNonThrowing({ ...params, throwOnError: false });
  }
}
