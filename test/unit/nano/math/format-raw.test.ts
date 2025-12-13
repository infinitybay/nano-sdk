import { formatRaw } from "../../../../src/nano/math/format-raw";
import { RAW_SCALE, RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";

describe("formatRaw", () => {
  test("formats raw values without grouping", () => {
    expect(formatRaw({ raw: RawAmountStrings.zero(), throwOnError: true })).toBe("0");
    expect(formatRaw({ raw: RawAmountStrings.max(), throwOnError: true })).toBe(RawAmountStrings.max());
  });

  test("returns results in non-throwing mode", () => {
    const result = formatRaw({ raw: "2000", groupingSize: 3, groupingSeparator: "," });
    assert(result.success);
    expect(result.data).toBe("2,000");
  });

  test("formats raw values with grouping separators", () => {
    expect(formatRaw({ raw: "1000000", groupingSize: 3, groupingSeparator: ",", throwOnError: true })).toBe(
      "1,000,000"
    );
    expect(formatRaw({ raw: "1234567890", groupingSize: 3, groupingSeparator: " ", throwOnError: true })).toBe(
      "1 234 567 890"
    );
  });

  test("formats nano values with specific decimal places", () => {
    const rawOnePointFive = (15n * 10n ** 29n).toString();
    expect(formatRaw({ raw: rawOnePointFive, unit: "nano", decimalPlaces: 3, throwOnError: true })).toBe("1.500");

    const rawOnePointTwoThreeFour = (1234n * 10n ** 27n).toString();
    expect(formatRaw({ raw: rawOnePointTwoThreeFour, unit: "nano", decimalPlaces: 6, throwOnError: true })).toBe(
      "1.234000"
    );
  });

  test("applies grouping and separators to nano output", () => {
    const raw = (1234567n * RAW_SCALE).toString();
    expect(
      formatRaw({
        raw: raw,
        unit: "nano",
        decimalPlaces: 2,
        decimalSeparator: ",",
        groupingSize: 3,
        groupingSeparator: ".",
        throwOnError: true,
      })
    ).toBe("1.234.567,00");
  });

  test("rejects invalid decimal place configuration", () => {
    expect(() =>
      formatRaw({ raw: RawAmountStrings.zero(), unit: "nano", decimalPlaces: -1, throwOnError: true })
    ).toThrow("Invalid decimal places value.");
    expect(() =>
      formatRaw({ raw: RawAmountStrings.zero(), unit: "nano", decimalPlaces: 31, throwOnError: true })
    ).toThrow("Invalid decimal places value.");
    const result = formatRaw({ raw: RawAmountStrings.zero(), unit: "nano", decimalPlaces: 31 });
    expect(result.success).toBe(false);
  });

  test("rejects invalid grouping size", () => {
    expect(() => formatRaw({ raw: "1000", groupingSize: 40, throwOnError: true })).toThrow(
      "Invalid grouping size value."
    );
    expect(() => formatRaw({ raw: "1000", groupingSize: -1, throwOnError: true })).toThrow(
      "Invalid grouping size value."
    );
  });

  test("rejects invalid format unit", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => formatRaw({ raw: RawAmountStrings.zero(), unit: "invalid" as any, throwOnError: true })).toThrow(
      "Invalid format unit."
    );
  });

  test("returns failure result when validation fails without throwing", () => {
    const invalidRaw = "-10";
    const result = formatRaw({ raw: invalidRaw });
    expect(result.success).toBe(false);
  });
});
