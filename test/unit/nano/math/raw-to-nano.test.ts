import { rawToNano } from "../../../../src/nano/math/raw-to-nano";
import { NanoAmountStrings, RAW_SCALE, RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("rawToNano", () => {
  test("converts smallest raw value to nano with full precision", () => {
    const expected = `0.${"0".repeat(29)}1`;
    expect(rawToNano({ raw: "1", throwOnError: true })).toBe(expected);
  });

  test("converts raw values with configurable decimal places", () => {
    const rawOneNano = RAW_SCALE.toString();
    expect(rawToNano({ raw: rawOneNano, decimalPlaces: 0, throwOnError: true })).toBe("1");

    const rawOnePointFive = (15n * 10n ** 29n).toString();
    expect(rawToNano({ raw: rawOnePointFive, decimalPlaces: 3, throwOnError: true })).toBe("1.500");
  });

  test("returns success result in non-throwing mode", () => {
    const rawOneNano = RAW_SCALE.toString();
    const result = rawToNano({ raw: rawOneNano, throwOnError: false });
    assert(result.success);
    expect(result.data).toBe(`1.${"0".repeat(30)}`);
  });

  test("handles maximum values without precision loss", () => {
    expect(rawToNano({ raw: RawAmountStrings.max(), throwOnError: true })).toBe(NanoAmountStrings.max());
  });

  test("applies grouping separators to nano output", () => {
    const raw = (1234567n * RAW_SCALE).toString();
    expect(
      rawToNano({
        raw: raw,
        decimalPlaces: 0,
        groupingSize: 3,
        groupingSeparator: ".",
        throwOnError: true,
      })
    ).toBe("1.234.567");
  });

  test("returns failure result for invalid raw input without throwing", () => {
    const result = rawToNano({ raw: "-1", throwOnError: false });
    expect(result.success).toBe(false);
  });

  test("throws for invalid inputs when configured to throw", () => {
    expect(() => rawToNano({ raw: "-1", throwOnError: true })).toThrow("Invalid raw value.");
    expect(() => rawToNano({ raw: RawAmountStrings.zero(), decimalPlaces: -1, throwOnError: true })).toThrow(
      "Invalid decimal places value."
    );
    expect(() => rawToNano({ raw: RawAmountStrings.zero(), decimalPlaces: 31, throwOnError: true })).toThrow(
      "Invalid decimal places value."
    );
  });

  test("returns failure result for invalid decimal precision without throwing", () => {
    const result = rawToNano({ raw: RawAmountStrings.zero(), decimalPlaces: 31, throwOnError: false });
    expect(result.success).toBe(false);
  });
});
