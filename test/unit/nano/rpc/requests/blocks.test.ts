import { BlocksRequest } from "../../../../../src/nano/rpc/requests/blocks";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlocksRequest schema", () => {
  test("validates blocks request with json flag", () => {
    const result = BlocksRequest().safeParse({
      action: "blocks",
      hashes: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
      json_block: true,
    });
    assert(result.success);
  });

  test("rejects blocks request with invalid hash list", () => {
    const result = BlocksRequest().safeParse({
      action: "blocks",
      hashes: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
