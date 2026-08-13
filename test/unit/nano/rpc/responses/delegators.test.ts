import { DelegatorsResponse } from "../../../../../src/nano/rpc/responses/delegators";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("DelegatorsResponse schema", () => {
  test("parses delegators response with empty delegators map", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: "",
    });
    assert(result.success);
  });

  test("parses delegators response", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Valid.Account1()]: TestData.Valid.RawAmount1(),
        [TestData.Valid.Account2()]: TestData.Valid.RawAmount2(),
      },
    });
    assert(result.success);
  });

  test("rejects delegators response with invalid account key", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.RawAmount1(),
      },
    });
    assert(!result.success);
  });
});
