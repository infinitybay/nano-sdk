import { Amount, AmountUnit, NanoAmountString, RawAmountString } from "../../../../src/nano/types/amount";
import { TestData } from "../../test-data";

describe("Amount schema validation", () => {
  test("validates parsing and unit conversion for raw and nano amounts", () => {
    const validRawAmounts = [
      TestData.Valid.RawAmount1(),
      TestData.Valid.RawAmount2(),
      TestData.Valid.RawAmount3(),
      TestData.Valid.RawAmount4(),
    ];
    const validNanoAmounts = [
      TestData.Valid.NanoAmount1(),
      TestData.Valid.NanoAmount2(),
      TestData.Valid.NanoAmount3(),
      TestData.Valid.NanoAmount4(),
    ];

    for (let i = 0; i < validRawAmounts.length; i++) {
      const amount1 = Amount.parse(validRawAmounts[i], AmountUnit.Raw);
      const amount2 = Amount.parse(validNanoAmounts[i], AmountUnit.Nano);
      expect(amount1.toString(AmountUnit.Raw)).toBe(validRawAmounts[i]);
      expect(amount2.toString(AmountUnit.Raw)).toBe(validRawAmounts[i]);
      expect(amount1.toString(AmountUnit.Nano)).toBe(validNanoAmounts[i]);
      expect(amount2.toString(AmountUnit.Nano)).toBe(validNanoAmounts[i]);
    }
  });

  test("accepts formatted nano amount strings", () => {
    const validNanoAmounts = [
      TestData.Valid.NanoAmount1(),
      TestData.Valid.NanoAmount2(),
      TestData.Valid.NanoAmount3(),
      TestData.Valid.NanoAmount4(),
    ];
    for (const validNanoAmount of validNanoAmounts) {
      expect(NanoAmountString().parse(validNanoAmount)).toBe(validNanoAmount);
    }
  });

  test("rejects raw amounts with invalid characters", () => {
    expect(RawAmountString().safeParse(TestData.Invalid.RawAmount.InvalidCharacters()).success).toBe(false);
  });

  test("rejects raw amounts containing decimal points", () => {
    expect(RawAmountString().safeParse(TestData.Invalid.RawAmount.InvalidDecimalPoint()).success).toBe(false);
  });

  test("rejects negative raw amounts", () => {
    expect(RawAmountString().safeParse(TestData.Invalid.RawAmount.Negative()).success).toBe(false);
  });

  test("rejects raw amounts exceeding maximum", () => {
    expect(RawAmountString().safeParse(TestData.Invalid.RawAmount.TooHigh()).success).toBe(false);
  });

  test("rejects nano amounts with invalid characters", () => {
    expect(NanoAmountString().safeParse(TestData.Invalid.NanoAmount.InvalidCharacters()).success).toBe(false);
  });

  test("rejects negative nano amounts", () => {
    expect(NanoAmountString().safeParse(TestData.Invalid.NanoAmount.Negative()).success).toBe(false);
  });

  test("rejects nano amounts exceeding maximum", () => {
    expect(NanoAmountString().safeParse(TestData.Invalid.NanoAmount.TooHigh()).success).toBe(false);
  });
});

describe("Amount arithmetic operations", () => {
  test("performs arithmetic operations within bounds", () => {
    const base = Amount.parse("1000");
    expect(base.plus("500").toString()).toBe("1500");
    expect(base.minus("500").toString()).toBe("500");
    expect(base.times(2).toString()).toBe("2000");
    expect(base.dividedBy(2).toString()).toBe("500");
  });

  test("throws when arithmetic exceeds allowed bounds", () => {
    const max = Amount.max();
    expect(() => max.plus(1)).toThrow();
    const min = Amount.min();
    expect(() => min.minus(1)).toThrow();
  });
});
