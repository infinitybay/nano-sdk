import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawMultiply } from "../../../../src/nano/math/raw-multiply";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode } from "../../../expect";

describe("rawMultiply", () => {
  test("multiplies raw values correctly (string inputs)", () => {
    expect(rawMultiply({ raw: "2", multiplier: "3", throwOnError: true })).toBe("6");
    expect(rawMultiply({ raw: "0", multiplier: "999", throwOnError: true })).toBe("0");
  });

  test("multiplies raw values correctly (bigint inputs)", () => {
    expect(rawMultiply({ raw: 2n, multiplier: 3n, throwOnError: true })).toBe(6n);
    expect(rawMultiply({ raw: 0n, multiplier: 999n, throwOnError: true })).toBe(0n);
  });

  test("returns success result in non-throwing mode with matching return types", () => {
    const stringResult = rawMultiply({ raw: "3", multiplier: "3", throwOnError: false });
    assert(stringResult.success);
    expect(stringResult.data).toBe("9");

    const bigintResult = rawMultiply({ raw: 3n, multiplier: 3n, throwOnError: false });
    assert(bigintResult.success);
    expect(bigintResult.data).toBe(9n);
  });

  test("handles large products that stay within bounds", () => {
    const factor = (BigInt(RawAmountStrings.max()) / 5n).toString();
    expect(rawMultiply({ raw: factor, multiplier: "5", throwOnError: true })).toBe(RawAmountStrings.max());
  });

  test("throws when the result exceeds the maximum", () => {
    assert(!rawMultiply({ raw: RawAmountStrings.max(), multiplier: "2", throwOnError: false }).success);
  });

  test("returns failure result when multiplication would overflow without throwing", () => {
    const result = rawMultiply({ raw: RawAmountStrings.max(), multiplier: "2", throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.ResultOutOfRange);
  });

  test("rejects invalid inputs", () => {
    assert(!rawMultiply({ raw: "", multiplier: "1", throwOnError: false }).success);
    assert(!rawMultiply({ raw: "1", multiplier: "-1", throwOnError: false }).success);
    assert(!rawMultiply({ raw: "abc", multiplier: "1", throwOnError: false }).success);
  });

  test("accepts mixed input types and returns matching output type", () => {
    expect(rawMultiply({ raw: "2", multiplier: 3n, throwOnError: true })).toBe("6");
    expect(rawMultiply({ raw: 2n, multiplier: "3", throwOnError: true })).toBe(6n);
  });

  test("supports multiplication by zero across types", () => {
    expect(rawMultiply({ raw: 10n, multiplier: "0", throwOnError: true })).toBe(0n);
    expect(rawMultiply({ raw: "10", multiplier: 0n, throwOnError: true })).toBe("0");
  });
});
