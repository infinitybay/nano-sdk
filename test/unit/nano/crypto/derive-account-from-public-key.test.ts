import {
  deriveAccountFromPublicKey,
  safeDeriveAccountFromPublicKey,
} from "../../../../src/nano/crypto/derive-account-from-public-key";
import { TestData } from "../../test-data";

describe("deriveAccountFromPublicKey function", () => {
  test("derives expected account from valid public key", () => {
    const validPublicKeys = [
      TestData.Valid.PublicKey1(),
      TestData.Valid.PublicKey2(),
      TestData.Valid.PublicKey3(),
      TestData.Valid.PublicKey4(),
    ];
    const expectedAccounts = [
      TestData.Valid.Account1(),
      TestData.Valid.Account2(),
      TestData.Valid.Account3(),
      TestData.Valid.Account4(),
    ];
    for (let i = 0; i < validPublicKeys.length; i++) {
      expect(deriveAccountFromPublicKey(validPublicKeys[i])).toBe(expectedAccounts[i]);
    }
  });

  test("rejects invalid public keys", () => {
    const invalidPublicKeys = [
      TestData.Invalid.PublicKey.InvalidCharacters(),
      TestData.Invalid.PublicKey.TooLong(),
      TestData.Invalid.PublicKey.TooShort(),
    ];
    for (const invalidPublicKey of invalidPublicKeys) {
      expect(safeDeriveAccountFromPublicKey(invalidPublicKey).success).toBe(false);
    }
  });
});
