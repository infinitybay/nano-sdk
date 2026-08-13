import { RawAmount, RawAmountString } from "../types/amount";
import { MathError } from "./math-error";
import { MathErrorCode } from "./math-error-code";

export type RawComparisonInputs = {
  raw: RawAmount | RawAmountString;
  compareTo: RawAmount | RawAmountString;
};

export function compareRawValues(
  leftValue: RawAmount | RawAmountString,
  rightValue: RawAmount | RawAmountString
): number {
  const leftResult = RawAmount().safeParse(leftValue);
  if (!leftResult.success) {
    throw new MathError(MathErrorCode.InvalidRaw, "Invalid raw value.");
  }

  const rightResult = RawAmount().safeParse(rightValue);
  if (!rightResult.success) {
    throw new MathError(MathErrorCode.InvalidCompareTo, "Invalid compareTo value.");
  }

  const left = leftResult.data;
  const right = rightResult.data;

  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
}
