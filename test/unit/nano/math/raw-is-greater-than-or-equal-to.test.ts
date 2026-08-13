import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawIsGreaterThanOrEqualTo } from "../../../../src/nano/math/raw-is-greater-than-or-equal-to";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("rawIsGreaterThanOrEqualTo", () => {
  test("returns true when left is larger than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        raw: RawAmountStrings.max(),
        compareTo: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(true);
    expect(rawIsGreaterThanOrEqualTo({ raw: 6n, compareTo: 4n, throwOnError: true })).toBe(true);
  });

  test("returns true when values are equal", () => {
    const value = (10n ** 10n).toString();
    expect(rawIsGreaterThanOrEqualTo({ raw: value, compareTo: value, throwOnError: true })).toBe(true);
    expect(rawIsGreaterThanOrEqualTo({ raw: 5n, compareTo: 5n, throwOnError: true })).toBe(true);
  });

  test("returns false when left is smaller than right", () => {
    expect(
      rawIsGreaterThanOrEqualTo({
        raw: RawAmountStrings.zero(),
        compareTo: RawAmountStrings.max(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsGreaterThanOrEqualTo({ raw: 1n, compareTo: 2n, throwOnError: true })).toBe(false);
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
    expectErrorCode(leftInvalid.error, MathErrorCode.InvalidRaw);

    const rightInvalid = rawIsGreaterThanOrEqualTo({
      raw: RawAmountStrings.zero(),
      compareTo: " ",
      throwOnError: false,
    });
    assert(!rightInvalid.checked);
    expectErrorCode(rightInvalid.error, MathErrorCode.InvalidCompareTo);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expectToThrowErrorCode(
      () => rawIsGreaterThanOrEqualTo({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: true }),
      MathErrorCode.InvalidRaw
    );
    expectToThrowErrorCode(
      () => rawIsGreaterThanOrEqualTo({ raw: RawAmountStrings.zero(), compareTo: "1.1", throwOnError: true }),
      MathErrorCode.InvalidCompareTo
    );
  });
});
