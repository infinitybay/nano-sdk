import { RawAmountString } from "../types/amount";

export type RawComparisonInputs = {
  raw: RawAmountString;
  compareTo: RawAmountString;
};

export function compareRawValues(leftValue: RawAmountString, rightValue: RawAmountString): number {
  const leftResult = RawAmountString().safeParse(leftValue);
  if (!leftResult.success) {
    throw new Error("Invalid raw value.");
  }

  const rightResult = RawAmountString().safeParse(rightValue);
  if (!rightResult.success) {
    throw new Error("Invalid compareTo value.");
  }

  const left = BigInt(leftResult.data);
  const right = BigInt(rightResult.data);

  if (left === right) {
    return 0;
  }

  return left > right ? 1 : -1;
}
