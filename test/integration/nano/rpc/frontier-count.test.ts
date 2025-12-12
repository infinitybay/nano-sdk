import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("frontier_count RPC integration", () => {
  test("returns frontier count", async () => {
    const result = await Nano.RPC.frontier_count(
      rpcUrl,
      {
        action: "frontier_count",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.count).toBeGreaterThan(0);
  });
});
