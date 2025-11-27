import { NanoToRawResponse } from "../../../../../src/nano/rpc/responses/nano-to-raw";
import { TestData } from "../../../test-data";

describe("NanoToRawResponse schema", () => {
  test("parses nano to raw response", () => {
    const result = NanoToRawResponse().safeParse({
      amount: TestData.Valid.RawAmount1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects nano to raw response with invalid amount", () => {
    const result = NanoToRawResponse().safeParse({
      amount: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
