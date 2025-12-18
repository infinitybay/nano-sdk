import { NanoAmountString, RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { formatRaw } from "./format-raw";

type RawToNanoParams = {
  raw: RawAmount | RawAmountString;
  decimalPlaces?: number;
  decimalSeparator?: "." | ",";
  groupingSize?: number;
  groupingSeparator?: "," | "." | " ";
} & (Throwing | NonThrowing);

function rawToNanoThrowing(params: RawToNanoParams & Throwing): NanoAmountString {
  return formatRaw({
    ...params,
    unit: "nano",
  });
}

function rawToNanoNonThrowing(params: RawToNanoParams & NonThrowing): Result<NanoAmountString> {
  try {
    return {
      success: true,
      data: rawToNanoThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function rawToNano(params: RawToNanoParams & NonThrowing): Result<NanoAmountString>;
export function rawToNano(params: RawToNanoParams & Throwing): NanoAmountString;
export function rawToNano(params: RawToNanoParams): NanoAmountString | Result<NanoAmountString>;
export function rawToNano(params: RawToNanoParams) {
  if (params.throwOnError === false) {
    return rawToNanoNonThrowing({ ...params, throwOnError: false });
  } else {
    return rawToNanoThrowing({ ...params, throwOnError: true });
  }
}
