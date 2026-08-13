import { AccountBalanceRequest } from "../../../../../src/nano/rpc/requests/account-balance";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountBalanceRequest schema", () => {
  test("validates account balance request with optional confirmation flag", () => {
    const result = AccountBalanceRequest().safeParse({
      action: "account_balance",
      account: TestData.Valid.Account1(),
      include_only_confirmed: true,
    });
    assert(result.success);
  });

  test("rejects account balance request with invalid account", () => {
    const result = AccountBalanceRequest().safeParse({
      action: "account_balance",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
