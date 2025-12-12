import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("populate_backlog RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("populates backlog", async () => {
    const result = await Nano.RPC.populate_backlog(
      rpcUrl,
      {
        action: "populate_backlog",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
