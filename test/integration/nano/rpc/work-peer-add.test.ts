import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("work_peer_add RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("adds a work peer", async () => {
    const result = await Nano.RPC.work_peer_add(
      rpcUrl,
      {
        action: "work_peer_add",
        address: "127.0.0.1",
        port: "7075",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
