import { RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Throwing } from "../types/throwing";

type RawIsZeroParams = {
  raw: RawAmountString;
} & (Throwing | NonThrowing);

function rawIsZeroThrowing(params: RawIsZeroParams & Throwing): boolean {
  const rawResult = RawAmountString().safeParse(params.raw);
  if (!rawResult.success) {
    throw new Error("Invalid raw value.");
  }
  return BigInt(rawResult.data) === 0n;
}

function rawIsZeroNonThrowing(params: RawIsZeroParams & NonThrowing): boolean {
  try {
    return rawIsZeroThrowing({ ...params, throwOnError: true });
  } catch (_e) {
    return false;
  }
}

export function rawIsZero(params: RawIsZeroParams & NonThrowing): boolean;
export function rawIsZero(params: RawIsZeroParams & Throwing): boolean;
export function rawIsZero(params: RawIsZeroParams): boolean;
export function rawIsZero(params: RawIsZeroParams) {
  if (params.throwOnError === true) {
    return rawIsZeroThrowing({ ...params, throwOnError: true });
  } else {
    return rawIsZeroNonThrowing({ ...params, throwOnError: false });
  }
}
