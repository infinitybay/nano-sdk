import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { rawModulo } from "../../../../src/nano/math/raw-modulo";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("rawModulo", () => {
  test("computes modulo correctly (string inputs)", () => {
    expect(rawModulo({ raw: "10", divisor: "3", throwOnError: true })).toBe("1");
    expect(rawModulo({ raw: RawAmountStrings.max(), divisor: RawAmountStrings.max(), throwOnError: true })).toBe("0");
  });

  test("computes modulo correctly (bigint inputs)", () => {
    expect(rawModulo({ raw: 10n, divisor: 3n, throwOnError: true })).toBe(1n);
    expect(rawModulo({ raw: 10n, divisor: 5n, throwOnError: true })).toBe(0n);
  });

  test("returns success result in non-throwing mode with matching return types", () => {
    const stringResult = rawModulo({ raw: "20", divisor: "6", throwOnError: false });
    assert(stringResult.success);
    expect(stringResult.data).toBe("2");

    const bigintResult = rawModulo({ raw: 20n, divisor: 6n, throwOnError: false });
    assert(bigintResult.success);
    expect(bigintResult.data).toBe(2n);
  });

  test("throws when divisor is zero", () => {
    expectToThrowErrorCode(
      () => rawModulo({ raw: "10", divisor: "0", throwOnError: true }),
      MathErrorCode.DivisionByZero
    );
  });

  test("returns failure result instead of throwing when errors occur without throwOnError", () => {
    const zeroDivisorResult = rawModulo({ raw: "10", divisor: "0", throwOnError: false });
    assert(!zeroDivisorResult.success);
    expectErrorCode(zeroDivisorResult.error, MathErrorCode.DivisionByZero);
  });

  test("rejects invalid inputs", () => {
    expectToThrowErrorCode(() => rawModulo({ raw: "", divisor: "1", throwOnError: true }), MathErrorCode.InvalidRaw);
    expectToThrowErrorCode(
      () => rawModulo({ raw: "1", divisor: "-1", throwOnError: true }),
      MathErrorCode.InvalidDivisor
    );

    const result = rawModulo({ raw: "abc", divisor: "1", throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.InvalidRaw);
  });

  test("accepts mixed input types and returns matching output type", () => {
    expect(rawModulo({ raw: "10", divisor: 3n, throwOnError: true })).toBe("1");
    expect(rawModulo({ raw: 10n, divisor: "3", throwOnError: true })).toBe(1n);
  });

  test("supports divisor larger than raw", () => {
    expect(rawModulo({ raw: "3", divisor: "5", throwOnError: true })).toBe("3");
    expect(rawModulo({ raw: 3n, divisor: 5n, throwOnError: true })).toBe(3n);
  });
});
