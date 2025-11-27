import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("work_peers_clear RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("clears work peers", async () => {
    const result = await Nano.RPC.Safe.work_peers_clear(
      rpcUrl,
      {
        action: "work_peers_clear",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
