import { AccountWeightRequest } from "../../../../../src/nano/rpc/requests/account-weight";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountWeightRequest schema", () => {
  test("validates account weight request", () => {
    const result = AccountWeightRequest().safeParse({
      action: "account_weight",
      account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test("rejects account weight request with invalid account", () => {
    const result = AccountWeightRequest().safeParse({
      action: "account_weight",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
