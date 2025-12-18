import { NanoAmountString, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

type NanoToRawParams = {
  nano: NanoAmountString;
} & (Throwing | NonThrowing);

function nanoToRawThrowing(params: NanoToRawParams & Throwing): RawAmountString {
  const nanoResult = NanoAmountString().safeParse(params.nano);
  if (!nanoResult.success) {
    throw new Error("Invalid nano value.");
  }

  const [integerPart, fractionPart = ""] = nanoResult.data.split(".");

  const rawResult = RawAmountString().safeParse(BigInt(`${integerPart}${fractionPart.padEnd(30, "0")}`).toString());
  if (!rawResult.success) {
    throw new Error("Invalid raw result.");
  }

  return rawResult.data;
}

function nanoToRawNonThrowing(params: NanoToRawParams & NonThrowing): Result<RawAmountString> {
  try {
    return {
      success: true,
      data: nanoToRawThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function nanoToRaw(params: NanoToRawParams & NonThrowing): Result<RawAmountString>;
export function nanoToRaw(params: NanoToRawParams & Throwing): RawAmountString;
export function nanoToRaw(params: NanoToRawParams): RawAmountString | Result<RawAmountString>;
export function nanoToRaw(params: NanoToRawParams) {
  if (params.throwOnError === false) {
    return nanoToRawNonThrowing({ ...params, throwOnError: false });
  } else {
    return nanoToRawThrowing({ ...params, throwOnError: true });
  }
}
