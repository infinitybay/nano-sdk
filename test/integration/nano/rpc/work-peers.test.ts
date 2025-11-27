import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("work_peers RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("lists work peers", async () => {
    const result = await Nano.RPC.Safe.work_peers(
      rpcUrl,
      {
        action: "work_peers",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
