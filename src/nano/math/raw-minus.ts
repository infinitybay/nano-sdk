import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawMinusParams = {
  raw: RawAmount | RawAmountString;
  subtrahend: RawAmount | RawAmountString;
};

export type RawMinusRawAmountParams = {
  raw: RawAmount;
  subtrahend: RawAmount | RawAmountString;
};

export type RawMinusRawAmountStringParams = {
  raw: RawAmountString;
  subtrahend: RawAmount | RawAmountString;
};

export type RawMinusRawAmountResult = Result<
  RawAmount,
  MathError<
    | MathErrorCode.InvalidRaw
    | MathErrorCode.InvalidSubtrahend
    | MathErrorCode.NegativeRaw
    | MathErrorCode.NegativeResult
    | MathErrorCode.NegativeSubtrahend
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;
export type RawMinusRawAmountStringResult = Result<
  RawAmountString,
  MathError<
    | MathErrorCode.InvalidRaw
    | MathErrorCode.InvalidSubtrahend
    | MathErrorCode.NegativeRaw
    | MathErrorCode.NegativeResult
    | MathErrorCode.NegativeSubtrahend
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;

export function rawMinus(params: RawMinusRawAmountParams & NonThrowing): RawMinusRawAmountResult;
export function rawMinus(params: RawMinusRawAmountParams & Throwing): RawAmount;
export function rawMinus(
  params: RawMinusRawAmountParams & (Throwing | NonThrowing)
): RawAmount | RawMinusRawAmountResult;
export function rawMinus(params: RawMinusRawAmountStringParams & NonThrowing): RawMinusRawAmountStringResult;
export function rawMinus(params: RawMinusRawAmountStringParams & Throwing): RawAmountString;
export function rawMinus(
  params: RawMinusRawAmountStringParams & (Throwing | NonThrowing)
): RawAmountString | RawMinusRawAmountStringResult;
export function rawMinus(params: RawMinusParams & (Throwing | NonThrowing)) {
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
        (typeof params.subtrahend === "bigint" && params.subtrahend < 0n) ||
        (typeof params.subtrahend === "string" && params.subtrahend.startsWith("-"))
      ) {
        return Result.err(
          new MathError(
            MathErrorCode.NegativeSubtrahend,
            "Invalid subtrahend value: negative raw amounts are not allowed."
          )
        );
      }

      const subtrahendResult = RawAmount().safeParse(params.subtrahend);
      if (!subtrahendResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidSubtrahend, "Invalid subtrahend value."));
      }

      const base = baseResult.data;
      const subtrahend = subtrahendResult.data;
      const difference = base - subtrahend;
      if (difference < 0n) {
        return Result.err(new MathError(MathErrorCode.NegativeResult, "Resulting raw amount must not be negative."));
      }

      const result = RawAmount().safeParse(difference);
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
