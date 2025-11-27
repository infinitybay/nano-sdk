import { BlockHashRequest } from "../../../../../src/nano/rpc/requests/block-hash";
import { TestData } from "../../../test-data";

describe("BlockHashRequest schema", () => {
  test("validates block hash request with json block", () => {
    const result = BlockHashRequest().safeParse({
      action: "block_hash",
      json_block: true,
      block: TestData.Valid.StateBlock1(),
    });
    expect(result.success).toBe(true);
  });

  test("validates block hash request with block string", () => {
    const result = BlockHashRequest().safeParse({
      action: "block_hash",
      json_block: false,
      block: "block-string",
    });
    expect(result.success).toBe(true);
  });

  test("rejects block hash request with mismatched json flag", () => {
    const result = BlockHashRequest().safeParse({
      action: "block_hash",
      json_block: true,
      block: "block-string",
    });
    expect(result.success).toBe(false);
  });
});
