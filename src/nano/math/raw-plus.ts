import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawPlusParams = {
  raw: RawAmount | RawAmountString;
  addend: RawAmount | RawAmountString;
};

export type RawPlusRawAmountParams = {
  raw: RawAmount;
  addend: RawAmount | RawAmountString;
};

export type RawPlusRawAmountStringParams = {
  raw: RawAmountString;
  addend: RawAmount | RawAmountString;
};

export type RawPlusRawAmountResult = Result<
  RawAmount,
  MathError<
    | MathErrorCode.InvalidAddend
    | MathErrorCode.InvalidRaw
    | MathErrorCode.NegativeAddend
    | MathErrorCode.NegativeRaw
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;
export type RawPlusRawAmountStringResult = Result<
  RawAmountString,
  MathError<
    | MathErrorCode.InvalidAddend
    | MathErrorCode.InvalidRaw
    | MathErrorCode.NegativeAddend
    | MathErrorCode.NegativeRaw
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;

export function rawPlus(params: RawPlusRawAmountParams & NonThrowing): RawPlusRawAmountResult;
export function rawPlus(params: RawPlusRawAmountParams & Throwing): RawAmount;
export function rawPlus(params: RawPlusRawAmountParams & (Throwing | NonThrowing)): RawAmount | RawPlusRawAmountResult;
export function rawPlus(params: RawPlusRawAmountStringParams & NonThrowing): RawPlusRawAmountStringResult;
export function rawPlus(params: RawPlusRawAmountStringParams & Throwing): RawAmountString;
export function rawPlus(
  params: RawPlusRawAmountStringParams & (Throwing | NonThrowing)
): RawAmountString | RawPlusRawAmountStringResult;
export function rawPlus(params: RawPlusParams & (Throwing | NonThrowing)) {
  const result = (() => {
    try {
      if (
        (typeof params.raw === "bigint" && params.raw < 0n) ||
        (typeof params.raw === "string" && params.raw.startsWith("-"))
      ) {
        return Result.err(
          new MathError(MathErrorCode.NegativeRaw, "Invalid raw value: negative raw amounts are not allowed.")
        );
      }

      const baseResult = RawAmount().safeParse(params.raw);
      if (!baseResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      if (
        (typeof params.addend === "bigint" && params.addend < 0n) ||
        (typeof params.addend === "string" && params.addend.startsWith("-"))
      ) {
        return Result.err(
          new MathError(MathErrorCode.NegativeAddend, "Invalid addend value: negative raw amounts are not allowed.")
        );
      }

      const addendResult = RawAmount().safeParse(params.addend);
      if (!addendResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidAddend, "Invalid addend value."));
      }

      const base = baseResult.data;
      const addend = addendResult.data;
      const sum = base + addend;

      const result = RawAmount().safeParse(sum);
      if (!result.success) {
        return Result.err(new MathError(MathErrorCode.ResultOutOfRange, "Resulting amount is no valid raw amount."));
      }

      if (typeof params.raw === "bigint") {
        return Result.ok(result.data);
      } else {
        return Result.ok(result.data.toString());
      }
    } catch (e) {
      return Result.err(new MathError(MathErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
