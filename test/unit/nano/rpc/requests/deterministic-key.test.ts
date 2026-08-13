import { DeterministicKeyRequest } from "../../../../../src/nano/rpc/requests/deterministic-key";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("DeterministicKeyRequest schema", () => {
  test("validates deterministic key request", () => {
    const result = DeterministicKeyRequest().safeParse({
      action: "deterministic_key",
      seed: TestData.Valid.Seed1(),
      index: TestData.Valid.SeedIndex1(),
    });
    assert(result.success);
  });

  test("rejects deterministic key request with invalid seed", () => {
    const result = DeterministicKeyRequest().safeParse({
      action: "deterministic_key",
      seed: TestData.Invalid.Seed.InvalidCharacters(),
      index: TestData.Valid.SeedIndex1(),
    });
    assert(!result.success);
  });

  test("rejects deterministic key request with negative index", () => {
    const result = DeterministicKeyRequest().safeParse({
      action: "deterministic_key",
      seed: TestData.Valid.Seed1(),
      index: -1,
    });
    assert(!result.success);
  });
});
