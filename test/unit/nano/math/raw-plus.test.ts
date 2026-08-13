import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawPlus, RawPlusRawAmountResult, RawPlusRawAmountStringResult } from "../../../../src/nano/math/raw-plus";
import { RawAmount, RawAmountString } from "../../../../src/nano/types/amount";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("rawPlus", () => {
  test("adds raw values correctly (string inputs)", () => {
    expect(rawPlus({ raw: "5", addend: "3", throwOnError: true })).toBe("8");
    expect(rawPlus({ raw: RawAmountStrings.zero(), addend: RawAmountStrings.zero(), throwOnError: true })).toBe("0");
  });

  test("adds raw values correctly (bigint inputs)", () => {
    expect(rawPlus({ raw: 5n, addend: 3n, throwOnError: true })).toBe(8n);
    expect(rawPlus({ raw: 0n, addend: 0n, throwOnError: true })).toBe(0n);
  });

  test("returns success result in non-throwing mode with matching return types", () => {
    const stringResult = rawPlus({ raw: "5", addend: "4", throwOnError: false });
    assert(stringResult.success);
    expect(stringResult.data).toBe("9");

    const bigintResult = rawPlus({ raw: 5n, addend: 4n, throwOnError: false });
    assert(bigintResult.success);
    expect(bigintResult.data).toBe(9n);
  });

  test("preserves default and explicit throwing overload inference", () => {
    const defaultString: RawAmountString = rawPlus({ raw: "5", addend: "4" });
    const throwingString: RawAmountString = rawPlus({ raw: "5", addend: "4", throwOnError: true });
    const nonThrowingString: RawPlusRawAmountStringResult = rawPlus({
      raw: "5",
      addend: "4",
      throwOnError: false,
    });
    const defaultBigint: RawAmount = rawPlus({ raw: 5n, addend: 4n });
    const throwingBigint: RawAmount = rawPlus({ raw: 5n, addend: 4n, throwOnError: true });
    const nonThrowingBigint: RawPlusRawAmountResult = rawPlus({ raw: 5n, addend: 4n, throwOnError: false });

    expect(defaultString).toBe("9");
    expect(throwingString).toBe("9");
    assert(nonThrowingString.success);
    expect(defaultBigint).toBe(9n);
    expect(throwingBigint).toBe(9n);
    assert(nonThrowingBigint.success);
  });

  test("handles additions near the maximum boundary", () => {
    const nearMax = (BigInt(RawAmountStrings.max()) - 1n).toString();
    expect(rawPlus({ raw: nearMax, addend: "1", throwOnError: true })).toBe(RawAmountStrings.max());
  });

  test("throws when the result exceeds the maximum", () => {
    const result = rawPlus({ raw: RawAmountStrings.max(), addend: "1", throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.ResultOutOfRange);
  });

  test("returns failure result when addition would overflow without throwing", () => {
    assert(!rawPlus({ raw: RawAmountStrings.max(), addend: "1", throwOnError: false }).success);
  });

  test("rejects invalid inputs", () => {
    assert(!rawPlus({ raw: "", addend: "1", throwOnError: false }).success);
    assert(!rawPlus({ raw: "1", addend: "-5", throwOnError: false }).success);
    assert(!rawPlus({ raw: "abc", addend: "1", throwOnError: false }).success);
  });

  test("explicitly rejects negative raw values", () => {
    expectToThrowErrorCode(() => rawPlus({ raw: "-1", addend: "1", throwOnError: true }), MathErrorCode.NegativeRaw);
    expectToThrowErrorCode(() => rawPlus({ raw: 1n, addend: -1n, throwOnError: true }), MathErrorCode.NegativeAddend);

    const result = rawPlus({ raw: "1", addend: "-1", throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.NegativeAddend);
  });

  test("accepts mixed input types and returns matching output type", () => {
    expect(rawPlus({ raw: "5", addend: 3n, throwOnError: true })).toBe("8");
    expect(rawPlus({ raw: 5n, addend: "3", throwOnError: true })).toBe(8n);
  });

  test("supports zero addition with bigint and string", () => {
    expect(rawPlus({ raw: 10n, addend: "0", throwOnError: true })).toBe(10n);
    expect(rawPlus({ raw: "10", addend: 0n, throwOnError: true })).toBe("10");
  });
});
