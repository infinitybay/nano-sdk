import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("available_supply RPC integration", () => {
  test("returns available supply", async () => {
    const result = await Nano.RPC.Safe.available_supply(
      rpcUrl,
      {
        action: "available_supply",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.available).toBeDefined();
  });
});
