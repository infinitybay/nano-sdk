import { Height, HeightBounds, HeightString } from "../../../../src/nano/types/height";
import { TestData } from "../../test-data";

describe("Height schema", () => {
  test("validates heights within allowed bounds", () => {
    const validHeights = [0, 1, 1234567890, HeightBounds.max()];
    for (const validHeight of validHeights) {
      expect(Height().parse(validHeight)).toBe(validHeight);
    }
  });

  test("rejects heights outside allowed bounds", () => {
    expect(Height().safeParse(-1).success).toBe(false);
    expect(Height().safeParse(HeightBounds.max() + 1).success).toBe(false);
  });

  test("rejects non-integer heights", () => {
    expect(Height().safeParse(1.5).success).toBe(false);
    expect(Height().safeParse("1").success).toBe(false);
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
    expect(HeightString().safeParse(TestData.Invalid.Height.InvalidCharacters()).success).toBe(false);
  });

  test("rejects heights containing decimal points", () => {
    expect(HeightString().safeParse(TestData.Invalid.Height.InvalidDecimalPoint()).success).toBe(false);
  });

  test("rejects negative heights", () => {
    expect(HeightString().safeParse(TestData.Invalid.Height.Negative()).success).toBe(false);
  });

  test("rejects heights exceeding maximum", () => {
    expect(HeightString().safeParse(TestData.Invalid.Height.TooHigh()).success).toBe(false);
  });
});
