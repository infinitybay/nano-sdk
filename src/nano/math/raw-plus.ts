import { RAW_MAX, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type RawPlusParams = {
  raw: RawAmountString;
  addend: RawAmountString;
} & (Throwing | NonThrowing);

function rawPlusThrowing(params: RawPlusParams & Throwing): RawAmountString {
  const baseResult = RawAmountString().safeParse(params.raw);
  if (!baseResult.success) {
    throw new Error("Invalid raw value.");
  }

  const addendResult = RawAmountString().safeParse(params.addend);
  if (!addendResult.success) {
    throw new Error("Invalid addend value.");
  }

  const base = BigInt(baseResult.data);
  const addend = BigInt(addendResult.data);

  const result = base + addend;
  if (result > RAW_MAX) {
    throw new Error(`Resulting amount may not be greater than ${RAW_MAX.toString()}!`);
  }

  const rawResult = RawAmountString().safeParse(result.toString());
  if (!rawResult.success) {
    throw new Error("Resulting amount is invalid.");
  }

  return rawResult.data;
}

function rawPlusNonThrowing(params: RawPlusParams & NonThrowing): Result<RawAmountString> {
  try {
    return {
      success: true,
      data: rawPlusThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawPlus(params: RawPlusParams & NonThrowing): Result<RawAmountString>;
export function rawPlus(params: RawPlusParams & Throwing): RawAmountString;
export function rawPlus(params: RawPlusParams): RawAmountString | Result<RawAmountString>;
export function rawPlus(params: RawPlusParams) {
  if (params.throwOnError === false) {
    return rawPlusNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawPlusThrowing({ ...params, throwOnError: true });
  }
}
