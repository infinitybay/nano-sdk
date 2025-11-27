import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("unchecked_keys RPC integration", () => {
  test("lists unchecked keys", async () => {
    const result = await Nano.RPC.Safe.unchecked_keys(
      rpcUrl,
      {
        action: "unchecked_keys",
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
