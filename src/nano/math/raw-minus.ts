import { RAW_MIN, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawMinusParams = {
  raw: RawAmountString;
  subtrahend: RawAmountString;
} & (Throwing | NonThrowing);

function rawMinusThrowing(params: RawMinusParams & Throwing): RawAmountString {
  const baseResult = RawAmountString().safeParse(params.raw);
  if (!baseResult.success) {
    throw new Error("Invalid raw value.");
  }

  const subtrahendResult = RawAmountString().safeParse(params.subtrahend);
  if (!subtrahendResult.success) {
    throw new Error("Invalid subtrahend value.");
  }

  const base = BigInt(baseResult.data);
  const subtrahend = BigInt(subtrahendResult.data);

  const result = base - subtrahend;
  if (result < RAW_MIN) {
    throw new Error(`Resulting amount may not be less than ${RAW_MIN.toString()}!`);
  }

  const rawResult = RawAmountString().safeParse(result.toString());
  if (!rawResult.success) {
    throw new Error("Resulting amount is invalid.");
  }

  return rawResult.data;
}

function rawMinusNonThrowing(params: RawMinusParams & NonThrowing): Result<RawAmountString> {
  try {
    return {
      success: true,
      data: rawMinusThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawMinus(params: RawMinusParams & NonThrowing): Result<RawAmountString>;
export function rawMinus(params: RawMinusParams & Throwing): RawAmountString;
export function rawMinus(params: RawMinusParams): RawAmountString | Result<RawAmountString>;
export function rawMinus(params: RawMinusParams) {
  if (params.throwOnError === false) {
    return rawMinusNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawMinusThrowing({ ...params, throwOnError: true });
  }
}
