import { derivePublicKeyFromAccount } from "../../../../src/nano/crypto/derive-public-key-from-account";
import { TestData } from "../../test-data";

describe("derivePublicKeyFromAccount function", () => {
  test("derives expected public key from valid account", () => {
    const validAccounts = [
      TestData.Valid.Account1(),
      TestData.Valid.Account2(),
      TestData.Valid.Account3(),
      TestData.Valid.Account4(),
    ];
    const expectedPublicKeys = [
      TestData.Valid.PublicKey1(),
      TestData.Valid.PublicKey2(),
      TestData.Valid.PublicKey3(),
      TestData.Valid.PublicKey4(),
    ];
    for (let i = 0; i < validAccounts.length; i++) {
      expect(derivePublicKeyFromAccount({ account: validAccounts[i], throwOnError: true })).toBe(expectedPublicKeys[i]);
    }
  });

  test("rejects invalid accounts", () => {
    const invalidAccounts = [
      TestData.Invalid.Account.ChecksumMismatch(),
      TestData.Invalid.Account.InvalidCharacters(),
      TestData.Invalid.Account.PrefixMissing(),
      TestData.Invalid.Account.PrefixWrong(),
      TestData.Invalid.Account.TooLong(),
      TestData.Invalid.Account.TooShort(),
    ];
    for (const invalidAccount of invalidAccounts) {
      expect(derivePublicKeyFromAccount({ account: invalidAccount, throwOnError: false }).success).toBe(false);
    }
  });
});
