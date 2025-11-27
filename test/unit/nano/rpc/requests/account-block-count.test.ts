import { AccountBlockCountRequest } from "../../../../../src/nano/rpc/requests/account-block-count";
import { TestData } from "../../../test-data";

describe("AccountBlockCountRequest schema", () => {
  test("validates account block count request", () => {
    const result = AccountBlockCountRequest().safeParse({
      action: "account_block_count",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account block count request with invalid account", () => {
    const result = AccountBlockCountRequest().safeParse({
      action: "account_block_count",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
