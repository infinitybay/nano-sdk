import { RepresentativesResponse } from "../../../../../src/nano/rpc/responses/representatives";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RepresentativesResponse schema", () => {
  test("parses representatives response with empty representatives map", () => {
    const result = RepresentativesResponse().safeParse({
      representatives: "",
    });
    assert(result.success);
  });

  test("parses representatives map", () => {
    const result = RepresentativesResponse().safeParse({
      representatives: {
        [TestData.Valid.Representative1()]: TestData.Valid.RawAmount1(),
        [TestData.Valid.Representative2()]: TestData.Valid.RawAmount2(),
      },
    });
    assert(result.success);
  });

  test("rejects representatives response with invalid account", () => {
    const result = RepresentativesResponse().safeParse({
      representatives: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.RawAmount1(),
      },
    });
    assert(!result.success);
  });
});
