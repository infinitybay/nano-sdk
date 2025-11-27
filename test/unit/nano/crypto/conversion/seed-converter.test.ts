import {
  bytesToSeed,
  safeBytesToSeed,
  safeSeedToBytes,
  seedToBytes,
} from "../../../../../src/nano/crypto/conversion/seed-converter";
import { TestData } from "../../../test-data";

describe("Seed conversion utilities", () => {
  test("round-trips seeds through byte conversion", () => {
    const validSeeds = [
      TestData.Valid.Seed1(),
      TestData.Valid.Seed2().toLowerCase(),
      TestData.Valid.Seed3(),
      TestData.Valid.Seed4().toUpperCase(),
    ];

    for (const validSeed of validSeeds) {
      const seedBytes = seedToBytes(validSeed);
      const seed = bytesToSeed(seedBytes);
      expect(seed.toUpperCase()).toBe(validSeed.toUpperCase());
    }
  });

  test("rejects invalid seeds", () => {
    const invalidSeeds = [
      TestData.Invalid.Seed.InvalidCharacters(),
      TestData.Invalid.Seed.TooLong(),
      TestData.Invalid.Seed.TooShort(),
    ];

    for (const invalidSeed of invalidSeeds) {
      expect(safeSeedToBytes(invalidSeed).success).toBe(false);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    expect(safeBytesToSeed(new Uint8Array([1, 2])).success).toBe(false);
  });
});
