import { DeterministicKeyResponse } from "../../../../../src/nano/rpc/responses/deterministic-key";
import { TestData } from "../../../test-data";

describe("DeterministicKeyResponse schema", () => {
  test("parses deterministic key response", () => {
    const result = DeterministicKeyResponse().safeParse({
      private: TestData.Valid.PrivateKey1(),
      public: TestData.Valid.PublicKey1(),
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects deterministic key response with invalid public key", () => {
    const result = DeterministicKeyResponse().safeParse({
      private: TestData.Valid.PrivateKey1(),
      public: TestData.Invalid.PublicKey.InvalidCharacters(),
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(false);
  });
});
