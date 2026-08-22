import { SeedIndex, SeedIndexBounds, SeedIndexString, SeedString } from "../../../../src/nano/types/seed";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("SeedString schema", () => {
  test("validates parsing of valid seeds", () => {
    const validSeeds = [TestData.Valid.Seed1(), TestData.Valid.Seed2(), TestData.Valid.Seed3(), TestData.Valid.Seed4()];
    for (const validSeed of validSeeds) {
      expect(SeedString().parse(validSeed)).toBe(validSeed);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(SeedString().parse(TestData.Valid.Seed1().toUpperCase())).toBe(TestData.Valid.Seed1().toUpperCase());
    expect(SeedString().parse(TestData.Valid.Seed1().toLowerCase())).toBe(TestData.Valid.Seed1().toLowerCase());
  });

  test("rejects seeds with invalid characters", () => {
    assert(!SeedString().safeParse(TestData.Invalid.Seed.InvalidCharacters()).success);
  });

  test("rejects seeds exceeding length limit", () => {
    assert(!SeedString().safeParse(TestData.Invalid.Seed.TooLong()).success);
  });

  test("rejects seeds below length requirement", () => {
    assert(!SeedString().safeParse(TestData.Invalid.Seed.TooShort()).success);
  });
});

describe("SeedIndex schema", () => {
  test("validates parsing of valid seed indices", () => {
    const validSeedIndices = [
      TestData.Valid.SeedIndex1(),
      TestData.Valid.SeedIndex2(),
      TestData.Valid.SeedIndex3(),
      TestData.Valid.SeedIndex4(),
    ];
    for (const validSeedIndex of validSeedIndices) {
      expect(SeedIndex().parse(validSeedIndex)).toBe(validSeedIndex);
    }
  });

  test("rejects seed indices outside bounds", () => {
    assert(!SeedIndex().safeParse(SeedIndexBounds.min() - 1).success);
    assert(!SeedIndex().safeParse(SeedIndexBounds.max() + 1).success);
  });

  test("rejects non-numeric seed indices", () => {
    assert(!SeedIndex().safeParse("5").success);
    assert(!SeedIndex().safeParse("A").success);
  });
});

describe("SeedIndexString schema", () => {
  test("validates seed index strings within bounds", () => {
    const validSeedIndices = [SeedIndexBounds.min().toString(), "1", SeedIndexBounds.max().toString()];
    for (const validSeedIndex of validSeedIndices) {
      expect(SeedIndexString().parse(validSeedIndex)).toBe(validSeedIndex);
    }
  });

  test("rejects seed index strings outside bounds", () => {
    assert(!SeedIndexString().safeParse((SeedIndexBounds.min() - 1).toString()).success);
    assert(!SeedIndexString().safeParse((SeedIndexBounds.max() + 1).toString()).success);
  });

  test("rejects non-canonical seed index strings", () => {
    const invalidSeedIndices = ["00", "01", "1.0", "+1", "A", ""];
    for (const invalidSeedIndex of invalidSeedIndices) {
      assert(!SeedIndexString().safeParse(invalidSeedIndex).success);
    }
  });

  test("rejects non-string seed indices", () => {
    assert(!SeedIndexString().safeParse(5).success);
  });
});
