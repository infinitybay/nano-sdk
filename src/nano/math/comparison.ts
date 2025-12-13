import { RawAmountString } from "../types/amount";

export type RawComparisonInputs = {
  left: RawAmountString;
  right: RawAmountString;
};

export function compareRawValues(leftValue: RawAmountString, rightValue: RawAmountString): number {
  const leftResult = RawAmountString().safeParse(leftValue);
  if (!leftResult.success) {
    throw new Error("Invalid left value.");
  }

  const rightResult = RawAmountString().safeParse(rightValue);
  if (!rightResult.success) {
    throw new Error("Invalid right value.");
  }

  const left = BigInt(leftResult.data);
  const right = BigInt(rightResult.data);

  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
}
