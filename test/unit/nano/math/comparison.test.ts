import { compareRawValues } from "../../../../src/nano/math/comparison";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("compareRawValues", () => {
  test("returns 0 when both values are equal", () => {
    const equalValues = [RawAmountStrings.zero(), RawAmountStrings.max()];
    for (const value of equalValues) {
      expect(compareRawValues(value, value)).toBe(0);
    }
    expect(compareRawValues(5n, 5n)).toBe(0);
    expect(compareRawValues(5n, "5")).toBe(0);
  });

  test("returns 1 when raw value is greater", () => {
    const compareTo = (BigInt(RawAmountStrings.max()) - 1n).toString();
    expect(compareRawValues(RawAmountStrings.max(), compareTo)).toBe(1);
    expect(compareRawValues("10", "2")).toBe(1);
    expect(compareRawValues(10n, 2n)).toBe(1);
  });

  test("returns -1 when raw value is smaller", () => {
    expect(compareRawValues(RawAmountStrings.zero(), "1")).toBe(-1);
    const raw = (BigInt(RawAmountStrings.min()) + 1n).toString();
    expect(compareRawValues(raw, RawAmountStrings.max())).toBe(-1);
    expect(compareRawValues(1n, 2n)).toBe(-1);
  });

  test("throws when raw value is invalid", () => {
    const invalidRawValues = ["", " ", "-1", "abc", (BigInt(RawAmountStrings.max()) + 1n).toString(), "1.0"];
    for (const raw of invalidRawValues) {
      expect(() => compareRawValues(raw, RawAmountStrings.zero())).toThrow();
    }
  });

  test("throws when compareTo value is invalid", () => {
    const invalidCompareToValues = ["", " ", "-5", "xyz", (BigInt(RawAmountStrings.max()) + 1n).toString(), "2.5"];
    for (const compareTo of invalidCompareToValues) {
      expect(() => compareRawValues(RawAmountStrings.zero(), compareTo)).toThrow();
    }
  });
});
