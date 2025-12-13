import { rawIsZero } from "../../../../src/nano/math/raw-is-zero";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("rawIsZero", () => {
  test("identifies zero raw amounts", () => {
    expect(rawIsZero({ raw: RawAmountStrings.zero(), throwOnError: true })).toBe(true);
    expect(rawIsZero({ raw: RawAmountStrings.min(), throwOnError: true })).toBe(true);
  });

  test("returns false for non-zero values", () => {
    expect(rawIsZero({ raw: "1", throwOnError: true })).toBe(false);
    expect(
      rawIsZero({
        raw: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns false for invalid values without throwing", () => {
    expect(rawIsZero({ raw: "" })).toBe(false);
    expect(rawIsZero({ raw: "-1" })).toBe(false);
  });

  test("throws for invalid values when throwOnError is true", () => {
    expect(() => rawIsZero({ raw: "", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawIsZero({ raw: "1.0", throwOnError: true })).toThrow("Invalid raw value.");
  });
});
