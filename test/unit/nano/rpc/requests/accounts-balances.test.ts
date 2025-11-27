import { AccountsBalancesRequest } from "../../../../../src/nano/rpc/requests/accounts-balances";
import { TestData } from "../../../test-data";

describe("AccountsBalancesRequest schema", () => {
  test("validates accounts balances request with optional confirmation flag", () => {
    const result = AccountsBalancesRequest().safeParse({
      action: "accounts_balances",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
      include_only_confirmed: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects accounts balances request with invalid account list", () => {
    const result = AccountsBalancesRequest().safeParse({
      action: "accounts_balances",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });
});
