import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("node_id RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("returns node identifier", async () => {
    const result = await Nano.RPC.Safe.node_id(
      rpcUrl,
      {
        action: "node_id",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
