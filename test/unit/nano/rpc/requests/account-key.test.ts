import { AccountKeyRequest } from "../../../../../src/nano/rpc/requests/account-key";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountKeyRequest schema", () => {
  test("validates account key request", () => {
    const result = AccountKeyRequest().safeParse({
      action: "account_key",
      account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test("rejects account key request with invalid account", () => {
    const result = AccountKeyRequest().safeParse({
      action: "account_key",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
