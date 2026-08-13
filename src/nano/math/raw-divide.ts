import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawDivideParams = {
  raw: RawAmount | RawAmountString;
  divisor: RawAmount | RawAmountString;
};

export type RawDivideRawAmountParams = {
  raw: RawAmount;
  divisor: RawAmount | RawAmountString;
};

export type RawDivideRawAmountStringParams = {
  raw: RawAmountString;
  divisor: RawAmount | RawAmountString;
};

export type RawDivideRawAmountResult = Result<
  RawAmount,
  MathError<
    | MathErrorCode.DivisionByZero
    | MathErrorCode.InvalidDivisor
    | MathErrorCode.InvalidRaw
    | MathErrorCode.NonIntegerResult
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;
export type RawDivideRawAmountStringResult = Result<
  RawAmountString,
  MathError<
    | MathErrorCode.DivisionByZero
    | MathErrorCode.InvalidDivisor
    | MathErrorCode.InvalidRaw
    | MathErrorCode.NonIntegerResult
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;

export function rawDivide(params: RawDivideRawAmountParams & NonThrowing): RawDivideRawAmountResult;
export function rawDivide(params: RawDivideRawAmountParams & Throwing): RawAmount;
export function rawDivide(
  params: RawDivideRawAmountParams & (Throwing | NonThrowing)
): RawAmount | RawDivideRawAmountResult;
export function rawDivide(params: RawDivideRawAmountStringParams & NonThrowing): RawDivideRawAmountStringResult;
export function rawDivide(params: RawDivideRawAmountStringParams & Throwing): RawAmountString;
export function rawDivide(
  params: RawDivideRawAmountStringParams & (Throwing | NonThrowing)
): RawAmountString | RawDivideRawAmountStringResult;
export function rawDivide(params: RawDivideParams & (Throwing | NonThrowing)) {
  const result = (() => {
    try {
      const dividendResult = RawAmount().safeParse(params.raw);
      if (!dividendResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      const divisorResult = RawAmount().safeParse(params.divisor);
      if (!divisorResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidDivisor, "Invalid divisor value."));
      }

      const dividend = dividendResult.data;
      const divisor = divisorResult.data;

      if (divisor === 0n) {
        return Result.err(new MathError(MathErrorCode.DivisionByZero, "Division by zero is not allowed."));
      }

      const quotient = dividend / divisor;
      const remainder = dividend % divisor;

      if (remainder !== 0n) {
        return Result.err(new MathError(MathErrorCode.NonIntegerResult, "Resulting amount must be an integer."));
      }

      const result = RawAmount().safeParse(quotient);
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
