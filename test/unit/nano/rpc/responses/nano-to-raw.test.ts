import { NanoToRawResponse } from "../../../../../src/nano/rpc/responses/nano-to-raw";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("NanoToRawResponse schema", () => {
  test("parses nano to raw response", () => {
    const result = NanoToRawResponse().safeParse({
      amount: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
  });

  test("rejects nano to raw response with invalid amount", () => {
    const result = NanoToRawResponse().safeParse({
      amount: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
