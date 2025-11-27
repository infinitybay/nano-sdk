import { AccountBalanceRequest } from "../../../../../src/nano/rpc/requests/account-balance";
import { TestData } from "../../../test-data";

describe("AccountBalanceRequest schema", () => {
  test("validates account balance request with optional confirmation flag", () => {
    const result = AccountBalanceRequest().safeParse({
      action: "account_balance",
      account: TestData.Valid.Account1(),
      include_only_confirmed: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects account balance request with invalid account", () => {
    const result = AccountBalanceRequest().safeParse({
      action: "account_balance",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
