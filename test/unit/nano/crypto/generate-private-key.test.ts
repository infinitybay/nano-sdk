import { generatePrivateKey } from "../../../../src/nano/crypto/generate-private-key";
import { PrivateKeyString } from "../../../../src/nano/types";
import { assert } from "../../../assert";

describe("generatePrivateKey function", () => {
  test("returns a valid private key", () => {
    const privateKeyResult = PrivateKeyString().safeParse(generatePrivateKey({ throwOnError: true }));
    assert(privateKeyResult.success);
  });
});
