import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawDivide } from "../../../../src/nano/math/raw-divide";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode } from "../../../expect";

describe("rawDivide", () => {
  test("divides raw values exactly (string inputs)", () => {
    expect(rawDivide({ raw: "10", divisor: "2", throwOnError: true })).toBe("5");

    const quotient = (BigInt(RawAmountStrings.max()) / 5n).toString();
    expect(rawDivide({ raw: RawAmountStrings.max(), divisor: "5", throwOnError: true })).toBe(quotient);
  });

  test("divides raw values exactly (bigint inputs)", () => {
    expect(rawDivide({ raw: 10n, divisor: 2n, throwOnError: true })).toBe(5n);
  });

  test("returns success result in non-throwing mode with matching return types", () => {
    const stringResult = rawDivide({ raw: "20", divisor: "4", throwOnError: false });
    assert(stringResult.success);
    expect(stringResult.data).toBe("5");

    const bigintResult = rawDivide({ raw: 20n, divisor: 4n, throwOnError: false });
    assert(bigintResult.success);
    expect(bigintResult.data).toBe(5n);
  });

  test("throws when divisor is zero", () => {
    assert(!rawDivide({ raw: "10", divisor: "0", throwOnError: false }).success);
  });

  test("throws when division leaves a remainder", () => {
    assert(!rawDivide({ raw: "10", divisor: "3", throwOnError: false }).success);
  });

  test("returns failure result instead of throwing when errors occur without throwOnError", () => {
    const zeroDivisorResult = rawDivide({ raw: "10", divisor: "0", throwOnError: false });
    const remainderResult = rawDivide({ raw: "10", divisor: "3", throwOnError: false });

    assert(!zeroDivisorResult.success);
    expectErrorCode(zeroDivisorResult.error, MathErrorCode.DivisionByZero);
    assert(!remainderResult.success);
    expectErrorCode(remainderResult.error, MathErrorCode.NonIntegerResult);
  });

  test("rejects invalid inputs", () => {
    const rawResult = rawDivide({ raw: "", divisor: "1", throwOnError: false });
    const divisorResult = rawDivide({ raw: "1", divisor: "abc", throwOnError: false });

    assert(!rawResult.success);
    expectErrorCode(rawResult.error, MathErrorCode.InvalidRaw);
    assert(!divisorResult.success);
    expectErrorCode(divisorResult.error, MathErrorCode.InvalidDivisor);
  });

  test("accepts mixed input types and returns matching output type", () => {
    expect(rawDivide({ raw: 10n, divisor: "2", throwOnError: true })).toBe(5n);
    expect(rawDivide({ raw: "10", divisor: 2n, throwOnError: true })).toBe("5");
  });
});
