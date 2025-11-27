import { AccountKeyRequest } from "../../../../../src/nano/rpc/requests/account-key";
import { TestData } from "../../../test-data";

describe("AccountKeyRequest schema", () => {
  test("validates account key request", () => {
    const result = AccountKeyRequest().safeParse({
      action: "account_key",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account key request with invalid account", () => {
    const result = AccountKeyRequest().safeParse({
      action: "account_key",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
