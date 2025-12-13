import { rawIsEqualTo } from "../../../../src/nano/math/raw-is-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("rawIsEqualTo", () => {
  test("returns true when values are equal", () => {
    const values = [RawAmountStrings.zero(), RawAmountStrings.max(), "123456789"];
    for (const value of values) {
      expect(rawIsEqualTo({ left: value, right: value, throwOnError: true })).toBe(true);
    }
  });

  test("returns false when values differ", () => {
    expect(
      rawIsEqualTo({
        left: RawAmountStrings.max(),
        right: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsEqualTo({ left: "1", right: "2", throwOnError: true })).toBe(false);
  });

  test("returns false for invalid inputs without throwing", () => {
    expect(rawIsEqualTo({ left: "", right: RawAmountStrings.zero() })).toBe(false);
    expect(rawIsEqualTo({ left: RawAmountStrings.zero(), right: "-1" })).toBe(false);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsEqualTo({ left: "", right: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid left value."
    );
    expect(() => rawIsEqualTo({ left: RawAmountStrings.zero(), right: "-1", throwOnError: true })).toThrow(
      "Invalid right value."
    );
  });
});
