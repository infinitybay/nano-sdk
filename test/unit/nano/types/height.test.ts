import { Height, HeightBounds, HeightString } from "../../../../src/nano/types/height";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("Height schema", () => {
  test("validates heights within allowed bounds", () => {
    const validHeights = [0, 1, 1234567890, HeightBounds.max()];
    for (const validHeight of validHeights) {
      expect(Height().parse(validHeight)).toBe(validHeight);
    }
  });

  test("rejects heights outside allowed bounds", () => {
    assert(!Height().safeParse(-1).success);
    assert(!Height().safeParse(HeightBounds.max() + 1).success);
  });

  test("rejects non-integer heights", () => {
    assert(!Height().safeParse(1.5).success);
    assert(!Height().safeParse("1").success);
  });
});

describe("HeightString schema", () => {
  test("validates heights within allowed bounds", () => {
    const validHeights = [
      TestData.Valid.Height1(),
      TestData.Valid.Height2(),
      TestData.Valid.Height3(),
      TestData.Valid.Height4(),
    ];
    for (const validHeight of validHeights) {
      expect(HeightString().parse(validHeight)).toBe(validHeight);
    }
  });

  test("rejects heights with invalid characters", () => {
    assert(!HeightString().safeParse(TestData.Invalid.Height.InvalidCharacters()).success);
  });

  test("rejects heights containing decimal points", () => {
    assert(!HeightString().safeParse(TestData.Invalid.Height.InvalidDecimalPoint()).success);
  });

  test("rejects negative heights", () => {
    assert(!HeightString().safeParse(TestData.Invalid.Height.Negative()).success);
  });

  test("rejects heights exceeding maximum", () => {
    assert(!HeightString().safeParse(TestData.Invalid.Height.TooHigh()).success);
  });
});
