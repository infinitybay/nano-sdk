import { RawToNanoResponse } from "../../../../../src/nano/rpc/responses/raw-to-nano";
import { TestData } from "../../../test-data";

describe("RawToNanoResponse schema", () => {
  test("parses raw to nano response", () => {
    const result = RawToNanoResponse().safeParse({
      amount: TestData.Valid.NanoAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects raw to nano response with invalid amount", () => {
    const result = RawToNanoResponse().safeParse({
      amount: TestData.Invalid.NanoAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
