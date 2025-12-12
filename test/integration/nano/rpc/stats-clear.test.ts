import assert from "assert";

import { Nano } from "../../../../src";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("stats_clear RPC integration", () => {
  test("clears node stats", async () => {
    const result = await Nano.RPC.stats_clear(
      rpcUrl,
      {
        action: "stats_clear",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.success).toBe("");
  });
});
