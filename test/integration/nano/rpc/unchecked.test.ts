import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("unchecked RPC integration", () => {
  test("returns unchecked blocks", async () => {
    const result = await Nano.RPC.unchecked(
      rpcUrl,
      {
        action: "unchecked",
        count: 1,
      },
      rpcRequestConfig
    );
    assert(result.success);
  });

  test("returns unchecked blocks as JSON", async () => {
    const result = await Nano.RPC.unchecked(
      rpcUrl,
      {
        action: "unchecked",
        json_block: true,
        count: 1,
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
