import { rawIsGreaterThanOrEqualTo } from "../../../../src/nano/math/raw-is-greater-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawIsGreaterThanOrEqualTo", () => {
  test("returns true when left is larger than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        raw: RawAmountStrings.max(),
        compareTo: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 10n).toString();
    expect(rawIsGreaterThanOrEqualTo({ raw: value, compareTo: value, throwOnError: true })).toBe(true);
  });

  test("returns false when left is smaller than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        raw: RawAmountStrings.zero(),
        compareTo: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const greaterResult = rawIsGreaterThanOrEqualTo({ raw: "2", compareTo: "1", throwOnError: false });
    assert(greaterResult.checked);
    expect(greaterResult.greaterOrEqual).toBe(true);

    const lesserResult = rawIsGreaterThanOrEqualTo({ raw: "1", compareTo: "2", throwOnError: false });
    assert(lesserResult.checked);
    expect(lesserResult.greaterOrEqual).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const leftInvalid = rawIsGreaterThanOrEqualTo({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: false });
    assert(!leftInvalid.checked);
    expect(leftInvalid.error).toBeInstanceOf(Error);

    const rightInvalid = rawIsGreaterThanOrEqualTo({
      raw: RawAmountStrings.zero(),
      compareTo: " ",
      throwOnError: false,
    });
    assert(!rightInvalid.checked);
    expect(rightInvalid.error).toBeInstanceOf(Error);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expect(() =>
      rawIsGreaterThanOrEqualTo({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: true })
    ).toThrow("Invalid raw value.");
    expect(() =>
      rawIsGreaterThanOrEqualTo({ raw: RawAmountStrings.zero(), compareTo: "1.1", throwOnError: true })
    ).toThrow("Invalid compareTo value.");
  });
});
