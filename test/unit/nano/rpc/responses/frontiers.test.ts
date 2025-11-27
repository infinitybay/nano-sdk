import { FrontiersResponse } from "../../../../../src/nano/rpc/responses/frontiers";
import { TestData } from "../../../test-data";

describe("FrontiersResponse schema", () => {
  test("parses frontiers map", () => {
    const result = FrontiersResponse().safeParse({
      frontiers: {
        [TestData.Valid.Account1()]: TestData.Valid.Hash1(),
        [TestData.Valid.Account2()]: TestData.Valid.Hash2(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects frontiers map with invalid hash value", () => {
    const result = FrontiersResponse().safeParse({
      frontiers: {
        [TestData.Valid.Account1()]: TestData.Invalid.Hash.InvalidCharacters(),
      },
    });
    expect(result.success).toBe(false);
  });
});
