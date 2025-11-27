import { AccountsFrontiersResponse } from "../../../../../src/nano/rpc/responses/accounts-frontiers";
import { TestData } from "../../../test-data";

describe("AccountsFrontiersResponse schema", () => {
  test("parses frontiers map", () => {
    const result = AccountsFrontiersResponse().safeParse({
      frontiers: {
        [TestData.Valid.Account1()]: TestData.Valid.Hash1(),
        [TestData.Valid.Account2()]: TestData.Valid.Hash2(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects frontiers map with invalid account key", () => {
    const result = AccountsFrontiersResponse().safeParse({
      frontiers: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.Hash1(),
      },
    });
    expect(result.success).toBe(false);
  });

  test("rejects frontiers map with invalid hash value", () => {
    const result = AccountsFrontiersResponse().safeParse({
      frontiers: {
        [TestData.Valid.Account1()]: TestData.Invalid.Hash.InvalidCharacters(),
      },
    });
    expect(result.success).toBe(false);
  });
});
