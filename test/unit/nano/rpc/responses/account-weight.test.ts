import { AccountWeightResponse } from "../../../../../src/nano/rpc/responses/account-weight";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountWeightResponse schema", () => {
  test("parses account weight response", () => {
    const result = AccountWeightResponse().safeParse({
      weight: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
  });

  test("rejects account weight response with invalid weight", () => {
    const result = AccountWeightResponse().safeParse({
      weight: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
