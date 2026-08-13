import { SeedIndex, SeedIndexBounds, SeedString } from "../../../../src/nano/types/seed";
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
