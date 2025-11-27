import { RepresentativesResponse } from "../../../../../src/nano/rpc/responses/representatives";
import { TestData } from "../../../test-data";

describe("RepresentativesResponse schema", () => {
  test("parses representatives response with empty representatives map", () => {
    const result = RepresentativesResponse().safeParse({
      representatives: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses representatives map", () => {
    const result = RepresentativesResponse().safeParse({
      representatives: {
        [TestData.Valid.Representative1()]: TestData.Valid.RawAmount1(),
        [TestData.Valid.Representative2()]: TestData.Valid.RawAmount2(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects representatives response with invalid account", () => {
    const result = RepresentativesResponse().safeParse({
      representatives: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.RawAmount1(),
      },
    });
    expect(result.success).toBe(false);
  });
});
