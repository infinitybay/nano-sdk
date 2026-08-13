import { BlockInfoRequest } from "../../../../../src/nano/rpc/requests/block-info";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BlockInfoRequest schema", () => {
  test("validates block info request with optional flags", () => {
    const result = BlockInfoRequest().safeParse({
      action: "block_info",
      hash: TestData.Valid.Hash1(),
      include_linked_account: true,
      json_block: true,
    });
    assert(result.success);
  });

  test("rejects block info request with invalid hash", () => {
    const result = BlockInfoRequest().safeParse({
      action: "block_info",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
