import { BlockCreateResponse } from "../../../../../src/nano/rpc/responses/block-create";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockCreateResponse schema", () => {
  test("parses block create response with json block", () => {
    const result = BlockCreateResponse({ json_block: true }).safeParse({
      hash: TestData.Valid.Hash1(),
      difficulty: TestData.Valid.WorkDifficulty1(),
      block: TestData.Valid.StateBlock1(),
    });
    assert(result.success);
  });

  test("parses block create response with string block", () => {
    const result = BlockCreateResponse({ json_block: false }).safeParse({
      hash: TestData.Valid.Hash2(),
      difficulty: TestData.Valid.WorkDifficulty2(),
      block: "block-string",
    });
    assert(result.success);
  });

  test("rejects block create response with invalid hash", () => {
    const result = BlockCreateResponse({ json_block: true }).safeParse({
      hash: TestData.Invalid.Hash.InvalidCharacters(),
      difficulty: TestData.Valid.WorkDifficulty1(),
      block: TestData.Valid.StateBlock1(),
    });
    assert(!result.success);
  });
});
