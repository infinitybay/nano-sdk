import { BlocksResponse } from "../../../../../src/nano/rpc/responses/blocks";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlocksResponse schema", () => {
  test.each([true, false])("parses empty blocks response when json_block is %s", (jsonBlock) => {
    const result = BlocksResponse({ json_block: jsonBlock }).safeParse({
      blocks: "",
    });
    assert(result.success);
  });

  test("parses blocks response with json blocks", () => {
    const result = BlocksResponse({ json_block: true }).safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: TestData.Valid.StateBlock1(),
        [TestData.Valid.Hash2()]: TestData.Valid.StateBlock2(),
      },
    });
    assert(result.success);
  });

  test("parses blocks response with string blocks", () => {
    const result = BlocksResponse({ json_block: false }).safeParse({
      blocks: {
        [TestData.Valid.Hash3()]: "block-data-1",
        [TestData.Valid.Hash4()]: "block-data-2",
      },
    });
    assert(result.success);
  });

  test("rejects blocks response with invalid hash key", () => {
    const result = BlocksResponse({ json_block: false }).safeParse({
      blocks: {
        [TestData.Invalid.Hash.InvalidCharacters()]: "block-data",
      },
    });
    assert(!result.success);
  });

  test("rejects non-empty string blocks response", () => {
    const result = BlocksResponse({ json_block: false }).safeParse({
      blocks: "block-data",
    });
    assert(!result.success);
  });
});
