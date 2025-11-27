import { AccountsRepresentativesRequest } from "../../../../../src/nano/rpc/requests/accounts-representatives";
import { TestData } from "../../../test-data";

describe("AccountsRepresentativesRequest schema", () => {
  test("validates accounts representatives request", () => {
    const result = AccountsRepresentativesRequest().safeParse({
      action: "accounts_representatives",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
    });
    expect(result.success).toBe(true);
  });

  test("rejects accounts representatives request with invalid account entry", () => {
    const result = AccountsRepresentativesRequest().safeParse({
      action: "accounts_representatives",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });
});
