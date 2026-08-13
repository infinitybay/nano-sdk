import { NanoAmountString, RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { formatRaw } from "./format-raw";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawToNanoParams = {
  raw: RawAmount | RawAmountString;
  decimalPlaces?: number;
  decimalSeparator?: "." | ",";
  groupingSize?: number;
  groupingSeparator?: "," | "." | " ";
};

export type RawToNanoResult = Result<
  NanoAmountString,
  MathError<MathErrorCode.FormatRawFailed | MathErrorCode.Unexpected>
>;

export function rawToNano(params: RawToNanoParams & NonThrowing): RawToNanoResult;
export function rawToNano(params: RawToNanoParams & Throwing): NanoAmountString;
export function rawToNano(params: RawToNanoParams & (Throwing | NonThrowing)): NanoAmountString | RawToNanoResult;
export function rawToNano(params: RawToNanoParams & (Throwing | NonThrowing)) {
  const result = ((): RawToNanoResult => {
    try {
      const formatted = formatRaw({
        raw: params.raw,
        unit: "nano",
        decimalPlaces: params.decimalPlaces,
        decimalSeparator: params.decimalSeparator,
        groupingSize: params.groupingSize,
        groupingSeparator: params.groupingSeparator,
        throwOnError: false,
      });
      if (!formatted.success) {
        return Result.err(
          new MathError(MathErrorCode.FormatRawFailed, "Failed to format raw amount as nano.", {
            cause: formatted.error,
          })
        );
      }

      return Result.ok(formatted.data);
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
