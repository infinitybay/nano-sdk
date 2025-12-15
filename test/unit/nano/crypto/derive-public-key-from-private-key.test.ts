import { derivePublicKeyFromPrivateKey } from "../../../../src/nano/crypto/derive-public-key-from-private-key";
import { TestData } from "../../test-data";

describe("derivePublicKeyFromPrivateKey function", () => {
  test("derives expected public key from valid private key", () => {
    const validPrivateKeys = [
      TestData.Valid.PrivateKey1(),
      TestData.Valid.PrivateKey2(),
      TestData.Valid.PrivateKey3(),
      TestData.Valid.PrivateKey4(),
    ];
    const expectedPublicKeys = [
      TestData.Valid.PublicKey1(),
      TestData.Valid.PublicKey2(),
      TestData.Valid.PublicKey3(),
      TestData.Valid.PublicKey4(),
    ];
    for (let i = 0; i < validPrivateKeys.length; i++) {
      expect(derivePublicKeyFromPrivateKey({ privateKey: validPrivateKeys[i], throwOnError: true })).toBe(
        expectedPublicKeys[i]
      );
    }
  });

  test("rejects invalid private keys", () => {
    const invalidPrivateKeys = [
      TestData.Invalid.PrivateKey.InvalidCharacters(),
      TestData.Invalid.PrivateKey.TooLong(),
      TestData.Invalid.PrivateKey.TooShort(),
    ];
    for (const invalidPrivateKey of invalidPrivateKeys) {
      expect(derivePublicKeyFromPrivateKey({ privateKey: invalidPrivateKey, throwOnError: false }).success).toBe(false);
    }
  });
});
