import { BlockCountRequest } from "../../../../../src/nano/rpc/requests/block-count";
import { assert } from "../../../../assert";

describe("BlockCountRequest schema", () => {
  test("validates block count request", () => {
    const result = BlockCountRequest().safeParse({
      action: "block_count",
    });
    assert(result.success);
  });

  test("rejects block count request with invalid action", () => {
    const result = BlockCountRequest().safeParse({
      action: "block_count_invalid",
    });
    assert(!result.success);
  });
});
