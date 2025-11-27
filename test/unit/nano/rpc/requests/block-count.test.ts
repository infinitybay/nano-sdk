import { BlockCountRequest } from "../../../../../src/nano/rpc/requests/block-count";

describe("BlockCountRequest schema", () => {
  test("validates block count request", () => {
    const result = BlockCountRequest().safeParse({
      action: "block_count",
    });
    expect(result.success).toBe(true);
  });

  test("rejects block count request with invalid action", () => {
    const result = BlockCountRequest().safeParse({
      action: "block_count_invalid",
    });
    expect(result.success).toBe(false);
  });
});
