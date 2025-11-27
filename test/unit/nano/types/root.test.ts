import { RootString, RootStrings } from "../../../../src/nano/types";
import { TestData } from "../../test-data";

describe("RootString schema", () => {
  test("validates parsing of valid roots", () => {
    const validRoots = [TestData.Valid.Root1(), TestData.Valid.Root2(), TestData.Valid.Root3(), TestData.Valid.Root4()];
    for (const validRoot of validRoots) {
      expect(RootString().parse(validRoot)).toBe(validRoot);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(RootString().parse(TestData.Valid.Root1().toUpperCase())).toBe(TestData.Valid.Root1().toUpperCase());
    expect(RootString().parse(TestData.Valid.Root1().toLowerCase())).toBe(TestData.Valid.Root1().toLowerCase());
  });

  test("ensures zero signature constant has expected length", () => {
    expect(RootStrings.zero()).toHaveLength(128);
  });

  test("rejects roots with invalid characters", () => {
    expect(RootString().safeParse(TestData.Invalid.Root.InvalidCharacters()).success).toBe(false);
  });

  test("rejects roots exceeding length limit", () => {
    expect(RootString().safeParse(TestData.Invalid.Root.TooLong()).success).toBe(false);
  });

  test("rejects roots below length requirement", () => {
    expect(RootString().safeParse(TestData.Invalid.Root.TooShort()).success).toBe(false);
  });
});
