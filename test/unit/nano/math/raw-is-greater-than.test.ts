import { rawIsGreaterThan } from "../../../../src/nano/math/raw-is-greater-than";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("rawIsGreaterThan", () => {
  test("returns true when left is larger than right", () => {
    expect(
      rawIsGreaterThan({
        left: RawAmountStrings.max(),
        right: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(true);
    expect(rawIsGreaterThan({ left: "5", right: "4", throwOnError: true })).toBe(true);
  });

  test("returns false when left is equal to or smaller than right", () => {
    expect(
      rawIsGreaterThan({
        left: RawAmountStrings.zero(),
        right: RawAmountStrings.zero(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsGreaterThan({ left: "3", right: "9", throwOnError: true })).toBe(false);
  });

  test("returns false for invalid inputs without throwing", () => {
    expect(rawIsGreaterThan({ left: "", right: RawAmountStrings.zero() })).toBe(false);
    expect(rawIsGreaterThan({ left: RawAmountStrings.zero(), right: "-1" })).toBe(false);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsGreaterThan({ left: "", right: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid left value."
    );
    expect(() => rawIsGreaterThan({ left: RawAmountStrings.zero(), right: "-1", throwOnError: true })).toThrow(
      "Invalid right value."
    );
  });
});
