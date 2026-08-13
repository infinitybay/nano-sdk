import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { nanoToRaw } from "../../../../src/nano/math/nano-to-raw";
import { NanoAmountStrings, RAW_SCALE, RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("nanoToRaw", () => {
  test("converts nano amounts to raw strings", () => {
    expect(nanoToRaw({ nano: NanoAmountStrings.zero(), throwOnError: true })).toBe(RawAmountStrings.zero());
    expect(nanoToRaw({ nano: "1", throwOnError: true })).toBe(RAW_SCALE.toString());
    expect(nanoToRaw({ nano: "0.000000000000000000000000000001", throwOnError: true })).toBe("1");
  });

  test("returns success result in non-throwing mode", () => {
    const result = nanoToRaw({ nano: "2", throwOnError: false });
    const expected = (2n * RAW_SCALE).toString();
    assert(result.success);
    expect(result.data).toBe(expected);
  });

  test("converts maximum nano value without loss", () => {
    expect(nanoToRaw({ nano: NanoAmountStrings.max(), throwOnError: true })).toBe(RawAmountStrings.max());
  });

  test("returns failure result when validation fails without throwing", () => {
    const invalidNanoValues = [
      "",
      " 0",
      "0 ",
      ".",
      ".0",
      "0.",
      "00",
      "00.0",
      "01.0",
      "0.0000000000000000000000000000001",
      "0.1234567890123456789012345678901",
    ];

    for (const nano of invalidNanoValues) {
      const result = nanoToRaw({ nano, throwOnError: false });
      assert(!result.success);
      expectErrorCode(result.error, MathErrorCode.InvalidNano);
    }
  });

  test("throws on invalid nano input when configured to throw", () => {
    expectToThrowErrorCode(() => nanoToRaw({ nano: "", throwOnError: true }), MathErrorCode.InvalidNano);
    expectToThrowErrorCode(
      () => nanoToRaw({ nano: "0.1234567890123456789012345678901", throwOnError: true }),
      MathErrorCode.InvalidNano
    );
    expectToThrowErrorCode(() => nanoToRaw({ nano: "-1", throwOnError: true }), MathErrorCode.InvalidNano);
  });
});
