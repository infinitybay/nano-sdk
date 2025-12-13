import { rawIsLessThan } from "../../../../src/nano/math/raw-is-less-than";
import { RawAmountStrings } from "../../../../src/nano/types/amount";

describe("rawIsLessThan", () => {
  test("returns true when left is smaller than right", () => {
    expect(rawIsLessThan({ left: RawAmountStrings.zero(), right: "1", throwOnError: true })).toBe(true);
    expect(
      rawIsLessThan({
        left: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns false when left is equal to or larger than right", () => {
    expect(
      rawIsLessThan({
        left: RawAmountStrings.max(),
        right: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsLessThan({ left: "9", right: "3", throwOnError: true })).toBe(false);
  });

  test("returns false for invalid inputs without throwing", () => {
    expect(rawIsLessThan({ left: "", right: RawAmountStrings.zero() })).toBe(false);
    expect(rawIsLessThan({ left: RawAmountStrings.zero(), right: "-3" })).toBe(false);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsLessThan({ left: "", right: "0", throwOnError: true })).toThrow("Invalid left value.");
    expect(() => rawIsLessThan({ left: "0", right: "-3", throwOnError: true })).toThrow("Invalid right value.");
  });
});
