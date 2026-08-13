import { RepublishResponse } from "../../../../../src/nano/rpc/responses/republish";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RepublishResponse schema", () => {
  test("parses republish response with block list", () => {
    const result = RepublishResponse().safeParse({
      success: "",
      blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
    });
    assert(result.success);
  });

  test("rejects republish response with invalid block hash", () => {
    const result = RepublishResponse().safeParse({
      success: "",
      blocks: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
