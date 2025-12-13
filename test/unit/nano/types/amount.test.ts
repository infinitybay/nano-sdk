import { NanoAmountString, RawAmountString } from "../../../../src/nano/types/amount";
import { TestData } from "../../test-data";

describe("Amount schema validation", () => {
  test("accepts raw amount strings", () => {
    const validRawAmounts = [
      TestData.Valid.RawAmount1(),
      TestData.Valid.RawAmount2(),
      TestData.Valid.RawAmount3(),
      TestData.Valid.RawAmount4(),
    ];
    for (const validRawAmount of validRawAmounts) {
      expect(RawAmountString().parse(validRawAmount)).toBe(validRawAmount);
    }
  });

  test("accepts nano amount strings", () => {
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
