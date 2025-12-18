import { rawIsEqualTo } from "../../../../src/nano/math/raw-is-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsEqualTo", () => {
  test("returns true when values are equal", () => {
    const values = [RawAmountStrings.zero(), RawAmountStrings.max(), "123456789"];
    for (const value of values) {
      expect(rawIsEqualTo({ raw: value, compareTo: value, throwOnError: true })).toBe(true);
    }
  });

  test("returns predicate result when values are equal without throwing", () => {
    const result = rawIsEqualTo({
      raw: RawAmountStrings.zero(),
      compareTo: RawAmountStrings.zero(),
      throwOnError: false,
    });
    expect(result).toEqual({ checked: true, equal: true });
  });

  test("returns false when values differ", () => {
    expect(
      rawIsEqualTo({
        raw: RawAmountStrings.max(),
        compareTo: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsEqualTo({ raw: "1", compareTo: "2", throwOnError: true })).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const leftInvalid = rawIsEqualTo({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: false });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);

    const rightInvalid = rawIsEqualTo({ raw: RawAmountStrings.zero(), compareTo: "-1", throwOnError: false });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsEqualTo({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid raw value."
    );
    expect(() => rawIsEqualTo({ raw: RawAmountStrings.zero(), compareTo: "-1", throwOnError: true })).toThrow(
      "Invalid compareTo value."
    );
  });
});
