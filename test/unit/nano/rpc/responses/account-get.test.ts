import { AccountGetResponse } from "../../../../../src/nano/rpc/responses/account-get";
import { TestData } from "../../../test-data";

describe("AccountGetResponse schema", () => {
  test("parses account get response", () => {
    const result = AccountGetResponse().safeParse({
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account get response with invalid account", () => {
    const result = AccountGetResponse().safeParse({
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
