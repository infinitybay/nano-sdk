import { rawIsZero } from "../../../../src/nano/math/raw-is-zero";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

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

  test("returns predicate results without throwing", () => {
    const zeroResult = rawIsZero({ raw: RawAmountStrings.zero() });
    assert(zeroResult.checked);
    expect(zeroResult.zero).toBe(true);

    const nonZeroResult = rawIsZero({ raw: RawAmountStrings.max() });
    assert(nonZeroResult.checked);
    expect(nonZeroResult.zero).toBe(false);
  });

  test("returns predicate error for invalid values without throwing", () => {
    const emptyResult = rawIsZero({ raw: "" });
    assert(!emptyResult.checked);
    expect(emptyResult.error).toBeInstanceOf(Error);

    const negativeResult = rawIsZero({ raw: "-1" });
    assert(!negativeResult.checked);
    expect(negativeResult.error).toBeInstanceOf(Error);
  });

  test("throws for invalid values when throwOnError is true", () => {
    expect(() => rawIsZero({ raw: "", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawIsZero({ raw: "1.0", throwOnError: true })).toThrow("Invalid raw value.");
  });
});
