import { RAW_SCALE, RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

function addGrouping(params: { integerPart: string; groupingSize: number; groupingSeparator: string }): string {
  if (params.groupingSize < 0 || params.groupingSize > 39) {
    throw new MathError(MathErrorCode.InvalidGroupingSize, "Invalid grouping size value.");
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
  rawValue: RawAmount;
  decimalPlaces: number;
  decimalSeparator: string;
  groupingSize: number;
  groupingSeparator: string;
}): string {
  if (params.decimalPlaces < 0 || params.decimalPlaces > 30) {
    throw new MathError(MathErrorCode.InvalidDecimalPlaces, "Invalid decimal places value.");
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

export type FormatRawParams = {
  raw: RawAmount | RawAmountString;
  unit?: FormatUnit;
  decimalPlaces?: number;
  decimalSeparator?: "." | ",";
  groupingSize?: number;
  groupingSeparator?: "," | "." | " ";
};

export type FormatRawResult = Result<
  string,
  MathError<
    | MathErrorCode.InvalidDecimalPlaces
    | MathErrorCode.InvalidFormatUnit
    | MathErrorCode.InvalidGroupingSize
    | MathErrorCode.InvalidRaw
    | MathErrorCode.Unexpected
  >
>;

export function formatRaw(params: FormatRawParams & NonThrowing): FormatRawResult;
export function formatRaw(params: FormatRawParams & Throwing): string;
export function formatRaw(params: FormatRawParams & (Throwing | NonThrowing)): string | FormatRawResult;
export function formatRaw(params: FormatRawParams & (Throwing | NonThrowing)) {
  const result = ((): FormatRawResult => {
    try {
      const rawResult = RawAmount().safeParse(params.raw);
      if (!rawResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      const unit = params.unit ?? "raw";

      if (unit !== "raw" && unit !== "nano") {
        return Result.err(new MathError(MathErrorCode.InvalidFormatUnit, "Invalid format unit."));
      }

      if (params.groupingSize !== undefined && (params.groupingSize < 0 || params.groupingSize > 39)) {
        return Result.err(new MathError(MathErrorCode.InvalidGroupingSize, "Invalid grouping size value."));
      }

      if (
        unit === "nano" &&
        params.decimalPlaces !== undefined &&
        (params.decimalPlaces < 0 || params.decimalPlaces > 30)
      ) {
        return Result.err(new MathError(MathErrorCode.InvalidDecimalPlaces, "Invalid decimal places value."));
      }

      const rawValue = rawResult.data;

      if (unit === "raw") {
        return Result.ok(
          params.groupingSize
            ? addGrouping({
                integerPart: rawValue.toString(),
                groupingSize: params.groupingSize,
                groupingSeparator: params.groupingSeparator ?? ",",
              })
            : rawValue.toString()
        );
      }

      return Result.ok(
        formatNanoFromRaw({
          rawValue: rawValue,
          decimalPlaces: params.decimalPlaces ?? 30,
          decimalSeparator: params.decimalSeparator ?? ".",
          groupingSize: params.groupingSize ?? 0,
          groupingSeparator: params.groupingSeparator ?? ",",
        })
      );
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
