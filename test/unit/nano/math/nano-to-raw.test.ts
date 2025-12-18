import { nanoToRaw } from "../../../../src/nano/math/nano-to-raw";
import { NanoAmountStrings, RAW_SCALE, RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

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

  test("applies grouping to raw output", () => {
    const nanoValue = "1234";
    const expected = "1,234,000,000,000,000,000,000,000,000,000,000";
    expect(nanoToRaw({ nano: nanoValue, groupingSize: 3, groupingSeparator: ",", throwOnError: true })).toBe(expected);
  });

  test("returns failure result when validation fails without throwing", () => {
    expect(nanoToRaw({ nano: "", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: " 0", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "0 ", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: ".", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: ".0", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "0.", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "00", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "00.0", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "01.0", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "0.0000000000000000000000000000001", throwOnError: false }).success).toBe(false);
    expect(nanoToRaw({ nano: "0.1234567890123456789012345678901", throwOnError: false }).success).toBe(false);
  });

  test("throws on invalid nano input when configured to throw", () => {
    expect(() => nanoToRaw({ nano: "", throwOnError: true })).toThrow();
    expect(() => nanoToRaw({ nano: "0.1234567890123456789012345678901", throwOnError: true })).toThrow();
    expect(() => nanoToRaw({ nano: "-1", throwOnError: true })).toThrow();
  });

  test("throws on invalid grouping options", () => {
    expect(() => nanoToRaw({ nano: "1", groupingSize: 40, throwOnError: true })).toThrow();
  });
});
