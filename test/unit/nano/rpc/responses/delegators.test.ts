import { DelegatorsResponse } from "../../../../../src/nano/rpc/responses/delegators";
import { TestData } from "../../../test-data";

describe("DelegatorsResponse schema", () => {
  test("parses delegators response with empty delegators map", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses delegators response", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Valid.Account1()]: TestData.Valid.RawAmount1(),
        [TestData.Valid.Account2()]: TestData.Valid.RawAmount2(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects delegators response with invalid account key", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.RawAmount1(),
      },
    });
    expect(result.success).toBe(false);
  });
});
