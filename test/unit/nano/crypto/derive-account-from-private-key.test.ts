import { deriveAccountFromPrivateKey } from "../../../../src/nano/crypto/derive-account-from-private-key";
import { TestData } from "../../test-data";

describe("deriveAccountFromPrivateKey function", () => {
  test("derives expected account from valid private key", () => {
    const validPrivateKeys = [
      TestData.Valid.PrivateKey1(),
      TestData.Valid.PrivateKey2(),
      TestData.Valid.PrivateKey3(),
      TestData.Valid.PrivateKey4(),
    ];
    const expectedAccounts = [
      TestData.Valid.Account1(),
      TestData.Valid.Account2(),
      TestData.Valid.Account3(),
      TestData.Valid.Account4(),
    ];
    for (let i = 0; i < validPrivateKeys.length; i++) {
      expect(deriveAccountFromPrivateKey({ privateKey: validPrivateKeys[i], throwOnError: true })).toBe(
        expectedAccounts[i]
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
      expect(deriveAccountFromPrivateKey({ privateKey: invalidPrivateKey }).success).toBe(false);
    }
  });
});
