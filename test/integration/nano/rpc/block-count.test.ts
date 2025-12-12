import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("block_count RPC integration", () => {
  test("returns block count", async () => {
    const result = await Nano.RPC.block_count(
      rpcUrl,
      {
        action: "block_count",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.cemented).toBeDefined();
    expect(result.data.count).toBeDefined();
    expect(result.data.unchecked).toBeDefined();
  });
});
