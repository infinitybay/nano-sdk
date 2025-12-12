import { accountToBytes, bytesToAccount } from "../../../../../src/nano/crypto/conversion/account-converter";
import { TestData } from "../../../test-data";

describe("Account conversion utilities", () => {
  test("round-trips accounts through byte conversion", () => {
    const validAccounts = [
      TestData.Valid.Account1(),
      TestData.Valid.Account2(),
      TestData.Valid.Account3(),
      TestData.Valid.Account4(),
    ];

    for (const validAccount of validAccounts) {
      const accountBytes = accountToBytes({ account: validAccount, throwOnError: true });
      const account = bytesToAccount({ publicKeyBytes: accountBytes, throwOnError: true });
      expect(account).toBe(validAccount);
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
      expect(accountToBytes({ account: invalidAccount }).success).toBe(false);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    expect(bytesToAccount({ publicKeyBytes: new Uint8Array([1, 2]) }).success).toBe(false);
  });
});
