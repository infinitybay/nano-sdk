import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawMinus } from "../../../../src/nano/math/raw-minus";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("rawMinus", () => {
  test("subtracts raw values correctly (string inputs)", () => {
    expect(rawMinus({ raw: "10", subtrahend: "3", throwOnError: true })).toBe("7");
    expect(rawMinus({ raw: "1", subtrahend: "1", throwOnError: true })).toBe("0");
  });

  test("subtracts raw values correctly (bigint inputs)", () => {
    expect(rawMinus({ raw: 10n, subtrahend: 3n, throwOnError: true })).toBe(7n);
    expect(rawMinus({ raw: 1n, subtrahend: 1n, throwOnError: true })).toBe(0n);
  });

  test("returns success result in non-throwing mode with matching return types", () => {
    const stringResult = rawMinus({ raw: "5", subtrahend: "2", throwOnError: false });
    assert(stringResult.success);
    expect(stringResult.data).toBe("3");

    const bigintResult = rawMinus({ raw: 5n, subtrahend: 2n, throwOnError: false });
    assert(bigintResult.success);
    expect(bigintResult.data).toBe(3n);
  });

  test("handles subtraction at the minimum boundary", () => {
    assert(!rawMinus({ raw: RawAmountStrings.min(), subtrahend: "1", throwOnError: false }).success);
  });

  test("returns failure result when subtraction would underflow without throwing", () => {
    const result = rawMinus({ raw: RawAmountStrings.min(), subtrahend: "1", throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.NegativeResult);
  });

  test("rejects invalid inputs", () => {
    assert(!rawMinus({ raw: "", subtrahend: "1", throwOnError: false }).success);
    assert(!rawMinus({ raw: "1", subtrahend: "-5", throwOnError: false }).success);
    assert(!rawMinus({ raw: "abc", subtrahend: "1", throwOnError: false }).success);
  });

  test("explicitly rejects negative raw values", () => {
    expectToThrowErrorCode(
      () => rawMinus({ raw: "-1", subtrahend: "1", throwOnError: true }),
      MathErrorCode.NegativeRaw
    );
    expectToThrowErrorCode(
      () => rawMinus({ raw: 1n, subtrahend: -1n, throwOnError: true }),
      MathErrorCode.NegativeSubtrahend
    );

    const result = rawMinus({ raw: "1", subtrahend: "-1", throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.NegativeSubtrahend);
  });

  test("accepts mixed input types and returns matching output type", () => {
    expect(rawMinus({ raw: "10", subtrahend: 3n, throwOnError: true })).toBe("7");
    expect(rawMinus({ raw: 10n, subtrahend: "3", throwOnError: true })).toBe(7n);
  });

  test("supports no-op subtraction", () => {
    expect(rawMinus({ raw: 10n, subtrahend: "0", throwOnError: true })).toBe(10n);
    expect(rawMinus({ raw: "10", subtrahend: 0n, throwOnError: true })).toBe("10");
  });
});
