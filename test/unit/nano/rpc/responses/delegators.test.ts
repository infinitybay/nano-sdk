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

  test("parses legacy account-ascending response without a continuation cursor", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Valid.Account2()]: TestData.Valid.RawAmount2(),
        [TestData.Valid.Account1()]: TestData.Valid.RawAmount1(),
      },
    });
    assert(result.success);
    expect(Object.keys(result.data.delegators)).toEqual([TestData.Valid.Account2(), TestData.Valid.Account1()]);
    expect(result.data.next).toBeUndefined();
  });

  test("parses indexed weight-descending response with a continuation cursor", () => {
    const next = `${TestData.Valid.RawAmount1()}:${TestData.Valid.Account1()}`;
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Valid.Account2()]: TestData.Valid.RawAmount2(),
        [TestData.Valid.Account1()]: TestData.Valid.RawAmount1(),
      },
      next,
    });
    assert(result.success);
    expect(Object.values(result.data.delegators)).toEqual([TestData.Valid.RawAmount2(), TestData.Valid.RawAmount1()]);
    expect(result.data.next).toBe(next);
  });

  test("rejects delegators response with invalid account key", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: {
        [TestData.Invalid.Account.InvalidCharacters()]: TestData.Valid.RawAmount1(),
      },
    });
    assert(!result.success);
  });

  test("rejects delegators response with invalid continuation cursor", () => {
    const result = DelegatorsResponse().safeParse({
      delegators: "",
      next: `${TestData.Valid.RawAmount1()}:invalid-account`,
    });
    assert(!result.success);
  });

  test.each([
    TestData.Valid.Account1(),
    `${TestData.Valid.RawAmount1()}:`,
    `:${TestData.Valid.Account1()}`,
    `invalid-weight:${TestData.Valid.Account1()}`,
  ])("rejects non-full continuation cursor %s", (next) => {
    const result = DelegatorsResponse().safeParse({
      delegators: "",
      next,
    });
    assert(!result.success);
  });
});
