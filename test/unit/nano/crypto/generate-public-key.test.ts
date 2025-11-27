import { generatePublicKey } from "../../../../src/nano/crypto/generate-public-key";
import { PublicKeyString } from "../../../../src/nano/types";

describe("generatePublicKey function", () => {
  test("returns a valid public key", () => {
    const publicKeyResult = PublicKeyString().safeParse(generatePublicKey());
    expect(publicKeyResult.success).toBe(true);
  });
});
