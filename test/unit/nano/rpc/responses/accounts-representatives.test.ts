import { AccountsRepresentativesResponse } from "../../../../../src/nano/rpc/responses/accounts-representatives";
import { TestData } from "../../../test-data";

describe("AccountsRepresentativesResponse schema", () => {
  test("parses representatives map", () => {
    const result = AccountsRepresentativesResponse().safeParse({
      representatives: {
        [TestData.Valid.Account1()]: TestData.Valid.Account2(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects representatives map with invalid account key", () => {
    const result = AccountsRepresentativesResponse().safeParse({
      representatives: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.Account2(),
      },
    });
    expect(result.success).toBe(false);
  });

  test("rejects representatives map with invalid account value", () => {
    const result = AccountsRepresentativesResponse().safeParse({
      representatives: {
        [TestData.Valid.Account1()]: TestData.Invalid.Account.InvalidCharacters(),
      },
    });
    expect(result.success).toBe(false);
  });
});
