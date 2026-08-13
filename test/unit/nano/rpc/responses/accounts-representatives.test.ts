import { AccountsRepresentativesResponse } from "../../../../../src/nano/rpc/responses/accounts-representatives";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountsRepresentativesResponse schema", () => {
  test("parses representatives map", () => {
    const result = AccountsRepresentativesResponse().safeParse({
      representatives: {
        [TestData.Valid.Account1()]: TestData.Valid.Account2(),
      },
    });
    assert(result.success);
  });

  test("rejects representatives map with invalid account key", () => {
    const result = AccountsRepresentativesResponse().safeParse({
      representatives: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.Account2(),
      },
    });
    assert(!result.success);
  });

  test("rejects representatives map with invalid account value", () => {
    const result = AccountsRepresentativesResponse().safeParse({
      representatives: {
        [TestData.Valid.Account1()]: TestData.Invalid.Account.InvalidCharacters(),
      },
    });
    assert(!result.success);
  });
});
