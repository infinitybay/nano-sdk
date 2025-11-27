import { BlockInfoRequest } from "../../../../../src/nano/rpc/requests/block-info";
import { TestData } from "../../../test-data";

describe("BlockInfoRequest schema", () => {
  test("validates block info request with optional flags", () => {
    const result = BlockInfoRequest().safeParse({
      action: "block_info",
      hash: TestData.Valid.Hash1(),
      include_linked_account: true,
      json_block: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects block info request with invalid hash", () => {
    const result = BlockInfoRequest().safeParse({
      action: "block_info",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
