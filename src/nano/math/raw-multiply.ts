import { RawAmount, RawAmountString } from "../types/amount";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawMultiplyParams = {
  raw: RawAmount | RawAmountString;
  multiplier: RawAmount | RawAmountString;
};

export type RawMultiplyRawAmountParams = {
  raw: RawAmount;
  multiplier: RawAmount | RawAmountString;
};

export type RawMultiplyRawAmountStringParams = {
  raw: RawAmountString;
  multiplier: RawAmount | RawAmountString;
};

export type RawMultiplyRawAmountResult = Result<
  RawAmount,
  MathError<
    | MathErrorCode.InvalidMultiplier
    | MathErrorCode.InvalidRaw
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;
export type RawMultiplyRawAmountStringResult = Result<
  RawAmountString,
  MathError<
    | MathErrorCode.InvalidMultiplier
    | MathErrorCode.InvalidRaw
    | MathErrorCode.ResultOutOfRange
    | MathErrorCode.Unexpected
  >
>;

export function rawMultiply(params: RawMultiplyRawAmountParams & NonThrowing): RawMultiplyRawAmountResult;
export function rawMultiply(params: RawMultiplyRawAmountParams & Throwing): RawAmount;
export function rawMultiply(
  params: RawMultiplyRawAmountParams & (Throwing | NonThrowing)
): RawAmount | RawMultiplyRawAmountResult;
export function rawMultiply(params: RawMultiplyRawAmountStringParams & NonThrowing): RawMultiplyRawAmountStringResult;
export function rawMultiply(params: RawMultiplyRawAmountStringParams & Throwing): RawAmountString;
export function rawMultiply(
  params: RawMultiplyRawAmountStringParams & (Throwing | NonThrowing)
): RawAmountString | RawMultiplyRawAmountStringResult;
export function rawMultiply(params: RawMultiplyParams & (Throwing | NonThrowing)) {
  const result = (() => {
    try {
      const baseResult = RawAmount().safeParse(params.raw);
      if (!baseResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidRaw, "Invalid raw value."));
      }

      const multiplierResult = RawAmount().safeParse(params.multiplier);
      if (!multiplierResult.success) {
        return Result.err(new MathError(MathErrorCode.InvalidMultiplier, "Invalid multiplier value."));
      }

      const base = baseResult.data;
      const multiplier = multiplierResult.data;
      const product = base * multiplier;

      const result = RawAmount().safeParse(product);
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
