import { AccountsRepresentativesRequest } from "../../../../../src/nano/rpc/requests/accounts-representatives";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountsRepresentativesRequest schema", () => {
  test("validates accounts representatives request", () => {
    const result = AccountsRepresentativesRequest().safeParse({
      action: "accounts_representatives",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
    });
    assert(result.success);
  });

  test("rejects accounts representatives request with invalid account entry", () => {
    const result = AccountsRepresentativesRequest().safeParse({
      action: "accounts_representatives",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
