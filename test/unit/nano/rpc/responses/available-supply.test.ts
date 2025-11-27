import { AvailableSupplyResponse } from "../../../../../src/nano/rpc/responses/available-supply";
import { TestData } from "../../../test-data";

describe("AvailableSupplyResponse schema", () => {
  test("parses available supply response", () => {
    const result = AvailableSupplyResponse().safeParse({
      available: TestData.Valid.RawAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects available supply response with invalid amount", () => {
    const result = AvailableSupplyResponse().safeParse({
      available: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
