import { AccountGetRequest } from "../../../../../src/nano/rpc/requests/account-get";
import { TestData } from "../../../test-data";

describe("AccountGetRequest schema", () => {
  test("validates account get request", () => {
    const result = AccountGetRequest().safeParse({
      action: "account_get",
      key: TestData.Valid.PublicKey1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account get request with invalid public key", () => {
    const result = AccountGetRequest().safeParse({
      action: "account_get",
      key: TestData.Invalid.PublicKey.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
