import { derivePrivateKeyFromSeed } from "../../../../src/nano/crypto/derive-private-key-from-seed";
import { TestData } from "../../test-data";

describe("derivePrivateKeyFromSeed function", () => {
  test("derives expected private key from valid seed and index", () => {
    const validSeeds = [TestData.Valid.Seed1(), TestData.Valid.Seed2(), TestData.Valid.Seed3(), TestData.Valid.Seed4()];
    const validSeedIndices = [
      TestData.Valid.SeedIndex1(),
      TestData.Valid.SeedIndex2(),
      TestData.Valid.SeedIndex3(),
      TestData.Valid.SeedIndex4(),
    ];
    const expectedPrivateKeys = [
      TestData.Valid.PrivateKey1(),
      TestData.Valid.PrivateKey2(),
      TestData.Valid.PrivateKey3(),
      TestData.Valid.PrivateKey4(),
    ];
    for (let i = 0; i < validSeeds.length; i++) {
      expect(
        derivePrivateKeyFromSeed({ seed: validSeeds[i], seedIndex: validSeedIndices[i], throwOnError: true })
      ).toBe(expectedPrivateKeys[i]);
    }
  });

  test("rejects invalid seeds", () => {
    const invalidSeeds = [
      TestData.Invalid.Seed.InvalidCharacters(),
      TestData.Invalid.Seed.TooLong(),
      TestData.Invalid.Seed.TooShort(),
    ];
    for (const invalidSeed of invalidSeeds) {
      expect(derivePrivateKeyFromSeed({ seed: invalidSeed, seedIndex: 0 }).success).toBe(false);
    }
  });
});
