import { UncheckedGetRequest } from "../../../../../src/nano/rpc/requests/unchecked-get";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("UncheckedGetRequest schema", () => {
  test("validates unchecked get request with optional json flag", () => {
    const result = UncheckedGetRequest().safeParse({
      action: "unchecked_get",
      hash: TestData.Valid.Hash1(),
      json_block: true,
    });
    assert(result.success);
  });

  test("rejects unchecked get request with invalid hash", () => {
    const result = UncheckedGetRequest().safeParse({
      action: "unchecked_get",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
