import { AccountWeightRequest } from "../../../../../src/nano/rpc/requests/account-weight";
import { TestData } from "../../../test-data";

describe("AccountWeightRequest schema", () => {
  test("validates account weight request", () => {
    const result = AccountWeightRequest().safeParse({
      action: "account_weight",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account weight request with invalid account", () => {
    const result = AccountWeightRequest().safeParse({
      action: "account_weight",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
