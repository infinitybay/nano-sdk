import { generateSeed } from "../../../../src/nano/crypto/generate-seed";
import { SeedString } from "../../../../src/nano/types";
import { assert } from "../../../assert";

describe("generateSeed function", () => {
  test("returns a valid seed", () => {
    const seedResult = SeedString().safeParse(generateSeed({ throwOnError: true }));
    assert(seedResult.success);
  });
});
