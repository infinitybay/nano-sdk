import { NanoAmountString, RawAmountString } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
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
    assert(!RawAmountString().safeParse(TestData.Invalid.RawAmount.InvalidCharacters()).success);
  });

  test("rejects raw amounts containing decimal points", () => {
    assert(!RawAmountString().safeParse(TestData.Invalid.RawAmount.InvalidDecimalPoint()).success);
  });

  test("rejects negative raw amounts", () => {
    assert(!RawAmountString().safeParse(TestData.Invalid.RawAmount.Negative()).success);
  });

  test("rejects raw amounts exceeding maximum", () => {
    assert(!RawAmountString().safeParse(TestData.Invalid.RawAmount.TooHigh()).success);
  });

  test("rejects nano amounts with invalid characters", () => {
    assert(!NanoAmountString().safeParse(TestData.Invalid.NanoAmount.InvalidCharacters()).success);
  });

  test("rejects negative nano amounts", () => {
    assert(!NanoAmountString().safeParse(TestData.Invalid.NanoAmount.Negative()).success);
  });

  test("rejects nano amounts exceeding maximum", () => {
    assert(!NanoAmountString().safeParse(TestData.Invalid.NanoAmount.TooHigh()).success);
  });
});
