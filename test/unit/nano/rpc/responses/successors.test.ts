import { SuccessorsResponse } from "../../../../../src/nano/rpc/responses/successors";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("SuccessorsResponse schema", () => {
  test("parses successors response with empty blocks map", () => {
    const result = SuccessorsResponse().safeParse({
      blocks: "",
    });
    assert(result.success);
  });

  test("parses successors response with block hashes", () => {
    const result = SuccessorsResponse().safeParse({
      blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
    });
    assert(result.success);
  });

  test("rejects successors response with invalid hash entry", () => {
    const result = SuccessorsResponse().safeParse({
      blocks: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
