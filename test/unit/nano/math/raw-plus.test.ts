import { rawPlus } from "../../../../src/nano/math/raw-plus";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawPlus", () => {
  test("adds raw values correctly", () => {
    expect(rawPlus({ raw: "5", addend: "3", throwOnError: true })).toBe("8");
    expect(rawPlus({ raw: RawAmountStrings.zero(), addend: RawAmountStrings.zero(), throwOnError: true })).toBe("0");
  });

  test("returns success result in non-throwing mode", () => {
    const result = rawPlus({ raw: "5", addend: "4" });
    assert(result.success);
    expect(result.data).toBe("9");
  });

  test("handles additions near the maximum boundary", () => {
    const nearMax = (BigInt(RawAmountStrings.max()) - 1n).toString();
    expect(rawPlus({ raw: nearMax, addend: "1", throwOnError: true })).toBe(RawAmountStrings.max());
  });

  test("throws when the result exceeds the maximum", () => {
    expect(() => rawPlus({ raw: RawAmountStrings.max(), addend: "1", throwOnError: true })).toThrow(
      "Resulting amount may not be greater than"
    );
  });

  test("returns failure result when addition would overflow without throwing", () => {
    const result = rawPlus({ raw: RawAmountStrings.max(), addend: "1" });
    expect(result.success).toBe(false);
  });

  test("rejects invalid inputs", () => {
    expect(() => rawPlus({ raw: "", addend: "1", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawPlus({ raw: "1", addend: "-5", throwOnError: true })).toThrow("Invalid addend value.");

    const result = rawPlus({ raw: "abc", addend: "1" });
    expect(result.success).toBe(false);
  });
});
