import { formatRaw } from "../../../../src/nano/math/format-raw";
import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { RAW_SCALE, RawAmountStrings } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";

describe("formatRaw", () => {
  test("formats raw values without grouping", () => {
    expect(formatRaw({ raw: RawAmountStrings.zero(), throwOnError: true })).toBe("0");
    expect(formatRaw({ raw: RawAmountStrings.max(), throwOnError: true })).toBe(RawAmountStrings.max());
    expect(formatRaw({ raw: 1234n, throwOnError: true })).toBe("1234");
  });

  test("returns results in non-throwing mode", () => {
    const result = formatRaw({ raw: "2000", groupingSize: 3, groupingSeparator: ",", throwOnError: false });
    assert(result.success);
    expect(result.data).toBe("2,000");

    const bigintResult = formatRaw({ raw: 2000n, groupingSize: 3, groupingSeparator: ",", throwOnError: false });
    assert(bigintResult.success);
    expect(bigintResult.data).toBe("2,000");
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
    const rawOnePointFiveString = (15n * 10n ** 29n).toString();
    expect(formatRaw({ raw: rawOnePointFiveString, unit: "nano", decimalPlaces: 3, throwOnError: true })).toBe("1.500");

    const rawOnePointTwoThreeFourString = (1234n * 10n ** 27n).toString();
    expect(formatRaw({ raw: rawOnePointTwoThreeFourString, unit: "nano", decimalPlaces: 6, throwOnError: true })).toBe(
      "1.234000"
    );

    const rawOnePointFive = 15n * 10n ** 29n;
    expect(formatRaw({ raw: rawOnePointFive, unit: "nano", decimalPlaces: 3, throwOnError: true })).toBe("1.500");
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
    expectToThrowErrorCode(
      () => formatRaw({ raw: RawAmountStrings.zero(), unit: "nano", decimalPlaces: -1, throwOnError: true }),
      MathErrorCode.InvalidDecimalPlaces
    );
    expectToThrowErrorCode(
      () => formatRaw({ raw: RawAmountStrings.zero(), unit: "nano", decimalPlaces: 31, throwOnError: true }),
      MathErrorCode.InvalidDecimalPlaces
    );
    const result = formatRaw({ raw: RawAmountStrings.zero(), unit: "nano", decimalPlaces: 31, throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.InvalidDecimalPlaces);
  });

  test("rejects invalid grouping size", () => {
    expectToThrowErrorCode(
      () => formatRaw({ raw: "1000", groupingSize: 40, throwOnError: true }),
      MathErrorCode.InvalidGroupingSize
    );
    expectToThrowErrorCode(
      () => formatRaw({ raw: "1000", groupingSize: -1, throwOnError: true }),
      MathErrorCode.InvalidGroupingSize
    );
  });

  test("rejects invalid format unit", () => {
    expectToThrowErrorCode(
      () => formatRaw({ raw: RawAmountStrings.zero(), unit: "invalid" as never, throwOnError: true }),
      MathErrorCode.InvalidFormatUnit
    );
  });

  test("returns failure result when validation fails without throwing", () => {
    const invalidRaw = "-10";
    const result = formatRaw({ raw: invalidRaw, throwOnError: false });
    assert(!result.success);
    expectErrorCode(result.error, MathErrorCode.InvalidRaw);
  });
});
