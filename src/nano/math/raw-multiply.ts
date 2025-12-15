import { RAW_MAX, RAW_MIN, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawMultiplyParams = {
  raw: RawAmountString;
  multiplier: RawAmountString;
} & (Throwing | NonThrowing);

function rawMultiplyThrowing(params: RawMultiplyParams & Throwing): RawAmountString {
  const baseResult = RawAmountString().safeParse(params.raw);
  if (!baseResult.success) {
    throw new Error("Invalid raw value.");
  }

  const multiplierResult = RawAmountString().safeParse(params.multiplier);
  if (!multiplierResult.success) {
    throw new Error("Invalid multiplier value.");
  }

  const base = BigInt(baseResult.data);
  const multiplier = BigInt(multiplierResult.data);

  const result = base * multiplier;
  if (result < RAW_MIN) {
    throw new Error(`Resulting amount may not be less than ${RAW_MIN.toString()}!`);
  }
  if (result > RAW_MAX) {
    throw new Error(`Resulting amount may not be greater than ${RAW_MAX.toString()}!`);
  }

  const rawResult = RawAmountString().safeParse(result.toString());
  if (!rawResult.success) {
    throw new Error("Resulting amount is invalid.");
  }

  return rawResult.data;
}

function rawMultiplyNonThrowing(params: RawMultiplyParams & NonThrowing): Result<RawAmountString> {
  try {
    return {
      success: true,
      data: rawMultiplyThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawMultiply(params: RawMultiplyParams & NonThrowing): Result<RawAmountString>;
export function rawMultiply(params: RawMultiplyParams & Throwing): RawAmountString;
export function rawMultiply(params: RawMultiplyParams): RawAmountString | Result<RawAmountString>;
export function rawMultiply(params: RawMultiplyParams) {
  if (params.throwOnError === false) {
    return rawMultiplyNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawMultiplyThrowing({ ...params, throwOnError: true });
  }
}
