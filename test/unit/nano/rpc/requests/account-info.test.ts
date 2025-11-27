import { AccountInfoRequest } from "../../../../../src/nano/rpc/requests/account-info";
import { TestData } from "../../../test-data";

describe("AccountInfoRequest schema", () => {
  test("validates account info request with optional flags", () => {
    const result = AccountInfoRequest().safeParse({
      action: "account_info",
      account: TestData.Valid.Account1(),
      representative: true,
      weight: true,
      receivable: true,
      include_confirmed: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects account info request with invalid account", () => {
    const result = AccountInfoRequest().safeParse({
      action: "account_info",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
