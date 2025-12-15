import { RAW_SCALE, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";

function addGrouping(params: { integerPart: string; groupingSize: number; groupingSeparator: string }): string {
  if (params.groupingSize < 0 || params.groupingSize > 39) {
    throw new Error("Invalid grouping size value.");
  }

  if (!params.groupingSize) {
    return params.integerPart;
  }

  if (!params.groupingSeparator) {
    return params.integerPart;
  }

  let result = "";
  for (let index = params.integerPart.length - 1, count = 0; index >= 0; index--) {
    result = params.integerPart[index] + result;
    count++;
    if (count === params.groupingSize && index !== 0) {
      result = `${params.groupingSeparator}${result}`;
      count = 0;
    }
  }
  return result;
}

function formatNanoFromRaw(params: {
  rawValue: bigint;
  decimalPlaces: number;
  decimalSeparator: string;
  groupingSize: number;
  groupingSeparator: string;
}): string {
  if (params.decimalPlaces < 0 || params.decimalPlaces > 30) {
    throw new Error("Invalid decimal places value.");
  }

  let integerPart = (params.rawValue / RAW_SCALE).toString();
  let fractionPart = (params.rawValue % RAW_SCALE).toString().padStart(30, "0");

  if (params.groupingSize) {
    integerPart = addGrouping({
      integerPart: integerPart,
      groupingSize: params.groupingSize,
      groupingSeparator: params.groupingSeparator,
    });
  }

  if (params.decimalPlaces === 0) {
    return integerPart;
  }

  fractionPart = fractionPart.slice(0, params.decimalPlaces);
  fractionPart = fractionPart.padEnd(params.decimalPlaces, "0");

  return `${integerPart}${params.decimalSeparator}${fractionPart}`;
}

type FormatUnit = "raw" | "nano";

type FormatRawParams = {
  raw: RawAmountString;
  unit?: FormatUnit;
  decimalPlaces?: number;
  decimalSeparator?: "." | ",";
  groupingSize?: number;
  groupingSeparator?: "," | "." | " ";
} & (Throwing | NonThrowing);

function formatRawThrowing(params: FormatRawParams & Throwing): string {
  const rawResult = RawAmountString().safeParse(params.raw);
  if (!rawResult.success) {
    throw new Error("Invalid raw value.");
  }

  const unit = params.unit ?? "raw";

  if (unit !== "raw" && unit !== "nano") {
    throw new Error("Invalid format unit.");
  }

  const rawValue = BigInt(rawResult.data);

  if (unit === "raw") {
    return params.groupingSize
      ? addGrouping({
          integerPart: rawValue.toString(),
          groupingSize: params.groupingSize,
          groupingSeparator: params.groupingSeparator ?? ",",
        })
      : rawValue.toString();
  }

  return formatNanoFromRaw({
    rawValue: rawValue,
    decimalPlaces: params.decimalPlaces ?? 30,
    decimalSeparator: params.decimalSeparator ?? ".",
    groupingSize: params.groupingSize ?? 0,
    groupingSeparator: params.groupingSeparator ?? ",",
  });
}

function formatRawNonThrowing(params: FormatRawParams & NonThrowing): Result<string> {
  try {
    return {
      success: true,
      data: formatRawThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function formatRaw(params: FormatRawParams & NonThrowing): Result<string>;
export function formatRaw(params: FormatRawParams & Throwing): string;
export function formatRaw(params: FormatRawParams): string | Result<string>;
export function formatRaw(params: FormatRawParams) {
  if (params.throwOnError === false) {
    return formatRawNonThrowing({ ...params, throwOnError: false });
  } else {
    return formatRawThrowing({ ...params, throwOnError: true });
  }
}
