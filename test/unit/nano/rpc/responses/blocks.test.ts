import { BlocksResponse } from "../../../../../src/nano/rpc/responses/blocks";
import { TestData } from "../../../test-data";

describe("BlocksResponse schema", () => {
  test("parses blocks response with json blocks", () => {
    const result = BlocksResponse({ json_block: true }).safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: TestData.Valid.StateBlock1(),
        [TestData.Valid.Hash2()]: TestData.Valid.StateBlock2(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses blocks response with string blocks", () => {
    const result = BlocksResponse({ json_block: false }).safeParse({
      blocks: {
        [TestData.Valid.Hash3()]: "block-data-1",
        [TestData.Valid.Hash4()]: "block-data-2",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects blocks response with invalid hash key", () => {
    const result = BlocksResponse({ json_block: false }).safeParse({
      blocks: {
        [TestData.Invalid.Hash.InvalidCharacters()]: "block-data",
      },
    });
    expect(result.success).toBe(false);
  });
});
