import { NanoToRawRequest } from "../../../../../src/nano/rpc/requests/nano-to-raw";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("NanoToRawRequest schema", () => {
  test("validates nano to raw request", () => {
    const result = NanoToRawRequest().safeParse({
      action: "nano_to_raw",
      amount: TestData.Valid.NanoAmount1(),
    });
    assert(result.success);
  });

  test("rejects nano to raw request with invalid amount", () => {
    const result = NanoToRawRequest().safeParse({
      action: "nano_to_raw",
      amount: TestData.Invalid.NanoAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
