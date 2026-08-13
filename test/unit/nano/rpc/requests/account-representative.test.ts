import { AccountRepresentativeRequest } from "../../../../../src/nano/rpc/requests/account-representative";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountRepresentativeRequest schema", () => {
  test("validates account representative request", () => {
    const result = AccountRepresentativeRequest().safeParse({
      action: "account_representative",
      account: TestData.Valid.Account1(),
    });
    assert(result.success);
  });

  test("rejects account representative request with invalid account", () => {
    const result = AccountRepresentativeRequest().safeParse({
      action: "account_representative",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
