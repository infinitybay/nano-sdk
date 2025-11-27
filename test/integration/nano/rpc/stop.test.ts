import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("stop RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("stops the node", async () => {
    const result = await Nano.RPC.Safe.stop(
      rpcUrl,
      {
        action: "stop",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
