import { generatePrivateKey } from "../../../../src/nano/crypto/generate-private-key";
import { PrivateKeyString } from "../../../../src/nano/types";

describe("generatePrivateKey function", () => {
  test("returns a valid private key", () => {
    const privateKeyResult = PrivateKeyString().safeParse(generatePrivateKey({ throwOnError: true }));
    expect(privateKeyResult.success).toBe(true);
  });
});
