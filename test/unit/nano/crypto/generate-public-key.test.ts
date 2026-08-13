import { generatePublicKey } from "../../../../src/nano/crypto/generate-public-key";
import { PublicKeyString } from "../../../../src/nano/types";
import { assert } from "../../../assert";

describe("generatePublicKey function", () => {
  test("returns a valid public key", () => {
    const publicKeyResult = PublicKeyString().safeParse(generatePublicKey({ throwOnError: true }));
    assert(publicKeyResult.success);
  });
});
