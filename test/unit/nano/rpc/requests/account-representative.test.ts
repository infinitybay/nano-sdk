import { AccountRepresentativeRequest } from "../../../../../src/nano/rpc/requests/account-representative";
import { TestData } from "../../../test-data";

describe("AccountRepresentativeRequest schema", () => {
  test("validates account representative request", () => {
    const result = AccountRepresentativeRequest().safeParse({
      action: "account_representative",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account representative request with invalid account", () => {
    const result = AccountRepresentativeRequest().safeParse({
      action: "account_representative",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
