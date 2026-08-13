import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawModuloParams = {
  raw: RawAmount | RawAmountString;
  divisor: RawAmount | RawAmountString;
};

export type RawModuloRawAmountParams = {
  raw: RawAmount;
  divisor: RawAmount | RawAmountString;
};

export type RawModuloRawAmountStringParams = {
  raw: RawAmountString;
  divisor: RawAmount | RawAmountString;
};

export type RawModuloRawAmountResult = Result<
  RawAmount,
  MathError<
    | MathErrorCode.DivisionByZero
    | MathErrorCode.InvalidDivisor
    | MathErrorCode.InvalidRaw
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;
export type RawModuloRawAmountStringResult = Result<
  RawAmountString,
  MathError<
    | MathErrorCode.DivisionByZero
    | MathErrorCode.InvalidDivisor
    | MathErrorCode.InvalidRaw
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;

export function rawModulo(params: RawModuloRawAmountParams & NonThrowing): RawModuloRawAmountResult;
export function rawModulo(params: RawModuloRawAmountParams & Throwing): RawAmount;
export function rawModulo(
  params: RawModuloRawAmountParams & (Throwing | NonThrowing)
): RawAmount | RawModuloRawAmountResult;
export function rawModulo(params: RawModuloRawAmountStringParams & NonThrowing): RawModuloRawAmountStringResult;
export function rawModulo(params: RawModuloRawAmountStringParams & Throwing): RawAmountString;
export function rawModulo(
  params: RawModuloRawAmountStringParams & (Throwing | NonThrowing)
): RawAmountString | RawModuloRawAmountStringResult;
export function rawModulo(params: RawModuloParams & (Throwing | NonThrowing)) {
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

      const remainder = dividend % divisor;

      const result = RawAmount().safeParse(remainder);
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
