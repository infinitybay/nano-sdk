import { RawToNanoRequest } from "../../../../../src/nano/rpc/requests/raw-to-nano";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RawToNanoRequest schema", () => {
  test("validates raw to nano request", () => {
    const result = RawToNanoRequest().safeParse({
      action: "raw_to_nano",
      amount: TestData.Valid.RawAmount1(),
    });
    assert(result.success);
  });

  test("rejects raw to nano request with invalid amount", () => {
    const result = RawToNanoRequest().safeParse({
      action: "raw_to_nano",
      amount: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
