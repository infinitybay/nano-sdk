import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

// Requires enable_control to be enabled
xdescribe("unchecked_clear RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("clears unchecked blocks", async () => {
    const result = await Nano.RPC.unchecked_clear(
      rpcUrl,
      {
        action: "unchecked_clear",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.success).toBe("");
  });
});
