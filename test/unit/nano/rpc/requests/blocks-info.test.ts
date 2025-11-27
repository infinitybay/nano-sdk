import { BlocksInfoRequest } from "../../../../../src/nano/rpc/requests/blocks-info";
import { TestData } from "../../../test-data";

describe("BlocksInfoRequest schema", () => {
  test("validates blocks info request with optional flags", () => {
    const result = BlocksInfoRequest().safeParse({
      action: "blocks_info",
      hashes: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
      include_linked_account: true,
      include_not_found: true,
      json_block: true,
      receivable: true,
      receive_hash: true,
      source: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects blocks info request with invalid hash entry", () => {
    const result = BlocksInfoRequest().safeParse({
      action: "blocks_info",
      hashes: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });
});
