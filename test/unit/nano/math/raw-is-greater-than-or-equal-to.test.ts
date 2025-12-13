import { rawIsGreaterThanOrEqualTo } from "../../../../src/nano/math/raw-is-greater-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("rawIsGreaterThanOrEqualTo", () => {
  test("returns true when left is larger than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        left: RawAmountStrings.max(),
        right: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 10n).toString();
    expect(rawIsGreaterThanOrEqualTo({ left: value, right: value, throwOnError: true })).toBe(true);
  });

  test("returns false when left is smaller than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        left: RawAmountStrings.zero(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns false for invalid inputs without throwing", () => {
    expect(rawIsGreaterThanOrEqualTo({ left: "", right: RawAmountStrings.zero() })).toBe(false);
    expect(rawIsGreaterThanOrEqualTo({ left: RawAmountStrings.zero(), right: " " })).toBe(false);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsGreaterThanOrEqualTo({ left: "", right: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid left value."
    );
    expect(() =>
      rawIsGreaterThanOrEqualTo({ left: RawAmountStrings.zero(), right: "1.1", throwOnError: true })
    ).toThrow("Invalid right value.");
  });
});
