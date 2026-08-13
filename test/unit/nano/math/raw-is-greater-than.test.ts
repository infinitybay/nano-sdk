import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawIsGreaterThan } from "../../../../src/nano/math/raw-is-greater-than";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("rawIsGreaterThan", () => {
  test("returns true when left is larger than right", () => {
    expect(
      rawIsGreaterThan({
        raw: RawAmountStrings.max(),
        compareTo: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(true);
    expect(rawIsGreaterThan({ raw: "5", compareTo: "4", throwOnError: true })).toBe(true);
    expect(rawIsGreaterThan({ raw: 6n, compareTo: 4n, throwOnError: true })).toBe(true);
  });

  test("returns false when left is equal to or smaller than right", () => {
    expect(
      rawIsGreaterThan({
        raw: RawAmountStrings.zero(),
        compareTo: RawAmountStrings.zero(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsGreaterThan({ raw: "3", compareTo: "9", throwOnError: true })).toBe(false);
    expect(rawIsGreaterThan({ raw: 3n, compareTo: 9n, throwOnError: true })).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const greaterResult = rawIsGreaterThan({ raw: "2", compareTo: "1", throwOnError: false });
    assert(greaterResult.checked);
    expect(greaterResult.greater).toBe(true);

    const lesserResult = rawIsGreaterThan({ raw: "1", compareTo: "2", throwOnError: false });
    assert(lesserResult.checked);
    expect(lesserResult.greater).toBe(false);
  });

  test("returns predicate error for invalid inputs without throwing", () => {
    const leftInvalid = rawIsGreaterThan({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: false });
    assert(!leftInvalid.checked);
    expectErrorCode(leftInvalid.error, MathErrorCode.InvalidRaw);

    const rightInvalid = rawIsGreaterThan({ raw: RawAmountStrings.zero(), compareTo: "-1", throwOnError: false });
    assert(!rightInvalid.checked);
    expectErrorCode(rightInvalid.error, MathErrorCode.InvalidCompareTo);
  });

  test("throws for invalid inputs when throwOnError is true", () => {
    expectToThrowErrorCode(
      () => rawIsGreaterThan({ raw: "", compareTo: RawAmountStrings.zero(), throwOnError: true }),
      MathErrorCode.InvalidRaw
    );
    expectToThrowErrorCode(
      () => rawIsGreaterThan({ raw: RawAmountStrings.zero(), compareTo: "-1", throwOnError: true }),
      MathErrorCode.InvalidCompareTo
    );
  });
});
