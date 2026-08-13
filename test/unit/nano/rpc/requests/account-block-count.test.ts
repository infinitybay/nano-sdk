import { AccountBlockCountRequest } from "../../../../../src/nano/rpc/requests/account-block-count";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountBlockCountRequest schema", () => {
  test("validates account block count request", () => {
    const result = AccountBlockCountRequest().safeParse({
      action: "account_block_count",
      account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test("rejects account block count request with invalid account", () => {
    const result = AccountBlockCountRequest().safeParse({
      action: "account_block_count",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
