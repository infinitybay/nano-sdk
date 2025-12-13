import { compareRawValues } from "../../../../src/nano/math/comparison";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("compareRawValues", () => {
  test("returns 0 when both values are equal", () => {
    const equalValues = [RawAmountStrings.zero(), RawAmountStrings.max()];
    for (const value of equalValues) {
      expect(compareRawValues(value, value)).toBe(0);
    }
  });

  test("returns 1 when left value is greater", () => {
    const right = (BigInt(RawAmountStrings.max()) - 1n).toString();
    expect(compareRawValues(RawAmountStrings.max(), right)).toBe(1);
    expect(compareRawValues("10", "2")).toBe(1);
  });

  test("returns -1 when left value is smaller", () => {
    expect(compareRawValues(RawAmountStrings.zero(), "1")).toBe(-1);
    const left = (BigInt(RawAmountStrings.min()) + 1n).toString();
    expect(compareRawValues(left, RawAmountStrings.max())).toBe(-1);
  });

  test("throws when left value is invalid", () => {
    const invalidLeftValues = ["", " ", "-1", "abc", (BigInt(RawAmountStrings.max()) + 1n).toString(), "1.0"];
    for (const left of invalidLeftValues) {
      expect(() => compareRawValues(left, RawAmountStrings.zero())).toThrow("Invalid left value.");
    }
  });

  test("throws when right value is invalid", () => {
    const invalidRightValues = ["", " ", "-5", "xyz", (BigInt(RawAmountStrings.max()) + 1n).toString(), "2.5"];
    for (const right of invalidRightValues) {
      expect(() => compareRawValues(RawAmountStrings.zero(), right)).toThrow("Invalid right value.");
    }
  });
});
