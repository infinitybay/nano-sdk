import { AccountsBalancesRequest } from "../../../../../src/nano/rpc/requests/accounts-balances";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountsBalancesRequest schema", () => {
  test("validates accounts balances request with optional confirmation flag", () => {
    const result = AccountsBalancesRequest().safeParse({
      action: "accounts_balances",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
      include_only_confirmed: true,
    });
    assert(result.success);
  });

  test("rejects accounts balances request with invalid account list", () => {
    const result = AccountsBalancesRequest().safeParse({
      action: "accounts_balances",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
