import { rawMultiply } from "../../../../src/nano/math/raw-multiply";
import { RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawMultiply", () => {
  test("multiplies raw values correctly", () => {
    expect(rawMultiply({ raw: "2", multiplier: "3", throwOnError: true })).toBe("6");
    expect(rawMultiply({ raw: "0", multiplier: "999", throwOnError: true })).toBe("0");
  });

  test("returns success result in non-throwing mode", () => {
    const result = rawMultiply({ raw: "3", multiplier: "3", throwOnError: false });
    assert(result.success);
    expect(result.data).toBe("9");
  });

  test("handles large products that stay within bounds", () => {
    const factor = (BigInt(RawAmountStrings.max()) / 5n).toString();
    expect(rawMultiply({ raw: factor, multiplier: "5", throwOnError: true })).toBe(RawAmountStrings.max());
  });

  test("throws when the result exceeds the maximum", () => {
    expect(() => rawMultiply({ raw: RawAmountStrings.max(), multiplier: "2", throwOnError: true })).toThrow(
      "Resulting amount may not be greater than"
    );
  });

  test("returns failure result when multiplication would overflow without throwing", () => {
    const result = rawMultiply({ raw: RawAmountStrings.max(), multiplier: "2", throwOnError: false });
    expect(result.success).toBe(false);
  });

  test("rejects invalid inputs", () => {
    expect(() => rawMultiply({ raw: "", multiplier: "1", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawMultiply({ raw: "1", multiplier: "-1", throwOnError: true })).toThrow("Invalid multiplier value.");

    const result = rawMultiply({ raw: "abc", multiplier: "1", throwOnError: false });
    expect(result.success).toBe(false);
  });
});
