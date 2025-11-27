import { AccountWeightResponse } from "../../../../../src/nano/rpc/responses/account-weight";
import { TestData } from "../../../test-data";

describe("AccountWeightResponse schema", () => {
  test("parses account weight response", () => {
    const result = AccountWeightResponse().safeParse({
      weight: TestData.Valid.RawAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account weight response with invalid weight", () => {
    const result = AccountWeightResponse().safeParse({
      weight: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
