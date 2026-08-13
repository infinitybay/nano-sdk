import { bytesToSeed, seedToBytes } from "../../../../../src/nano/crypto/conversion/seed-converter";
import { assert } from "../../../../assert";
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
      const seedBytes = seedToBytes({ seed: validSeed, throwOnError: true });
      const seed = bytesToSeed({ seedBytes, throwOnError: true });
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
      assert(!seedToBytes({ seed: invalidSeed, throwOnError: false }).success);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    assert(!bytesToSeed({ seedBytes: new Uint8Array([1, 2]), throwOnError: false }).success);
  });
});
