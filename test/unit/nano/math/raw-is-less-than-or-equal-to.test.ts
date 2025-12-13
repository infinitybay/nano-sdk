import { rawIsLessThanOrEqualTo } from "../../../../src/nano/math/raw-is-less-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("rawIsLessThanOrEqualTo", () => {
  test("returns true when left is smaller than right", () => {
    expect(
      rawIsLessThanOrEqualTo({
        left: RawAmountStrings.zero(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 5n).toString();
    expect(rawIsLessThanOrEqualTo({ left: value, right: value, throwOnError: true })).toBe(true);
  });

  test("returns false when left is greater than right", () => {
    expect(
      rawIsLessThanOrEqualTo({
        left: RawAmountStrings.max(),
        right: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns false for invalid inputs without throwing", () => {
    expect(rawIsLessThanOrEqualTo({ left: RawAmountStrings.zero(), right: "abc" })).toBe(false);
    expect(rawIsLessThanOrEqualTo({ left: " ", right: RawAmountStrings.zero() })).toBe(false);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsLessThanOrEqualTo({ left: " ", right: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid left value."
    );
    expect(() => rawIsLessThanOrEqualTo({ left: RawAmountStrings.zero(), right: "abc", throwOnError: true })).toThrow(
      "Invalid right value."
    );
  });
});
