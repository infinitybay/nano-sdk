import { generateSeed } from "../../../../src/nano/crypto/generate-seed";
import { SeedString } from "../../../../src/nano/types";

describe("generateSeed function", () => {
  test("returns a valid seed", () => {
    const seedResult = SeedString().safeParse(generateSeed({ throwOnError: true }));
    expect(seedResult.success).toBe(true);
  });
});
