import { AccountGetRequest } from "../../../../../src/nano/rpc/requests/account-get";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountGetRequest schema", () => {
  test("validates account get request", () => {
    const result = AccountGetRequest().safeParse({
      action: "account_get",
      key: TestData.Valid.PublicKey1(),
    });
    assert(result.success);
  });

  test("rejects account get request with invalid public key", () => {
    const result = AccountGetRequest().safeParse({
      action: "account_get",
      key: TestData.Invalid.PublicKey.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
