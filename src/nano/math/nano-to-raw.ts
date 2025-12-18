import { NanoAmountString, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { formatRaw } from "./format-raw";

type NanoToRawParams = {
  nano: NanoAmountString;
  groupingSize?: number;
  groupingSeparator?: "," | "." | " ";
} & (Throwing | NonThrowing);

function nanoToRawThrowing(params: NanoToRawParams & Throwing): RawAmountString {
  const nanoResult = NanoAmountString().safeParse(params.nano);
  if (!nanoResult.success) {
    throw new Error("Invalid nano value.");
  }

  const [integerPart, fractionPart = ""] = nanoResult.data.split(".");

  const rawUnnormalized = `${integerPart}${fractionPart.padEnd(30, "0")}`;
  const rawNormalized = BigInt(rawUnnormalized);

  return formatRaw({
    ...params,
    raw: rawNormalized,
    unit: "raw",
  });
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
