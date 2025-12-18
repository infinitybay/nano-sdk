import { rawIsLessThanOrEqualTo } from "../../../../src/nano/math/raw-is-less-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsLessThanOrEqualTo", () => {
  test("returns true when left is smaller than right", () => {
    expect(
      rawIsLessThanOrEqualTo({
        raw: RawAmountStrings.zero(),
        compareTo: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 5n).toString();
    expect(rawIsLessThanOrEqualTo({ raw: value, compareTo: value, throwOnError: true })).toBe(true);
  });

  test("returns false when left is greater than right", () => {
    expect(
      rawIsLessThanOrEqualTo({
        raw: RawAmountStrings.max(),
        compareTo: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const lessResult = rawIsLessThanOrEqualTo({ raw: "1", compareTo: "2", throwOnError: false });
    assert(lessResult.checked);
    expect(lessResult.lessOrEqual).toBe(true);

    const greaterResult = rawIsLessThanOrEqualTo({ raw: "3", compareTo: "2", throwOnError: false });
    assert(greaterResult.checked);
    expect(greaterResult.lessOrEqual).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const rightInvalid = rawIsLessThanOrEqualTo({
      raw: RawAmountStrings.zero(),
      compareTo: "abc",
      throwOnError: false,
    });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);

    const leftInvalid = rawIsLessThanOrEqualTo({
      raw: " ",
      compareTo: RawAmountStrings.zero(),
      throwOnError: false,
    });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() => rawIsLessThanOrEqualTo({ raw: " ", compareTo: RawAmountStrings.zero(), throwOnError: true })).toThrow(
      "Invalid raw value."
    );
    expect(() =>
      rawIsLessThanOrEqualTo({ raw: RawAmountStrings.zero(), compareTo: "abc", throwOnError: true })
    ).toThrow("Invalid compareTo value.");
  });
});
