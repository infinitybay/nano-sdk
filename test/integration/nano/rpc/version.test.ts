import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("version RPC integration", () => {
  test("returns node version", async () => {
    const result = await Nano.RPC.Safe.version(
      rpcUrl,
      {
        action: "version",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.rpc_version).toBe(1);
  });
});
