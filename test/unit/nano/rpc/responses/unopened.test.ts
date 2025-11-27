import { UnopenedResponse } from "../../../../../src/nano/rpc/responses/unopened";
import { TestData } from "../../../test-data";

describe("UnopenedResponse schema", () => {
  test("parses unopened response with empty accounts map", () => {
    const result = UnopenedResponse().safeParse({
      accounts: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses unopened accounts map", () => {
    const result = UnopenedResponse().safeParse({
      accounts: {
        [TestData.Valid.Account1()]: TestData.Valid.RawAmount1(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects unopened response with invalid account key", () => {
    const result = UnopenedResponse().safeParse({
      accounts: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.RawAmount1(),
      },
    });
    expect(result.success).toBe(false);
  });
});
