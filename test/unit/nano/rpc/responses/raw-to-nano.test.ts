import { RawToNanoResponse } from "../../../../../src/nano/rpc/responses/raw-to-nano";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RawToNanoResponse schema", () => {
  test("parses raw to nano response", () => {
    const result = RawToNanoResponse().safeParse({
      amount: TestData.Valid.NanoAmount1(),
    });
    assert(result.success);
  });

  test("rejects raw to nano response with invalid amount", () => {
    const result = RawToNanoResponse().safeParse({
      amount: TestData.Invalid.NanoAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
