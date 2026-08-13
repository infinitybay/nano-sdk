import { AvailableSupplyResponse } from "../../../../../src/nano/rpc/responses/available-supply";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AvailableSupplyResponse schema", () => {
  test("parses available supply response", () => {
    const result = AvailableSupplyResponse().safeParse({
      available: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
  });

  test("rejects available supply response with invalid amount", () => {
    const result = AvailableSupplyResponse().safeParse({
      available: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
