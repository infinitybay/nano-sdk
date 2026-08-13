import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawIsZero } from "../../../../src/nano/math/raw-is-zero";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("rawIsZero", () => {
  test("identifies zero raw amounts", () => {
    expect(rawIsZero({ raw: RawAmountStrings.zero(), throwOnError: true })).toBe(true);
    expect(rawIsZero({ raw: RawAmountStrings.min(), throwOnError: true })).toBe(true);
    expect(rawIsZero({ raw: 0n, throwOnError: true })).toBe(true);
  });

  test("returns false for non-zero values", () => {
    expect(rawIsZero({ raw: "1", throwOnError: true })).toBe(false);
    expect(
      rawIsZero({
        raw: (BigInt(RawAmountStrings.max()) - 1n).toString(),
        throwOnError: true,
      })
    ).toBe(false);
    expect(rawIsZero({ raw: 2n, throwOnError: true })).toBe(false);
  });

  test("returns predicate results without throwing", () => {
    const zeroResult = rawIsZero({ raw: RawAmountStrings.zero(), throwOnError: false });
    assert(zeroResult.checked);
    expect(zeroResult.zero).toBe(true);

    const nonZeroResult = rawIsZero({ raw: RawAmountStrings.max(), throwOnError: false });
    assert(nonZeroResult.checked);
    expect(nonZeroResult.zero).toBe(false);

    const bigintResult = rawIsZero({ raw: 1n, throwOnError: false });
    assert(bigintResult.checked);
    expect(bigintResult.zero).toBe(false);
  });

  test("returns predicate error for invalid values without throwing", () => {
    const emptyResult = rawIsZero({ raw: "", throwOnError: false });
    assert(!emptyResult.checked);
    expectErrorCode(emptyResult.error, MathErrorCode.InvalidRaw);

    const negativeResult = rawIsZero({ raw: "-1", throwOnError: false });
    assert(!negativeResult.checked);
    expectErrorCode(negativeResult.error, MathErrorCode.InvalidRaw);
  });

  test("throws for invalid values when throwOnError is true", () => {
    expectToThrowErrorCode(() => rawIsZero({ raw: "", throwOnError: true }), MathErrorCode.InvalidRaw);
    expectToThrowErrorCode(() => rawIsZero({ raw: "1.0", throwOnError: true }), MathErrorCode.InvalidRaw);
  });
});
