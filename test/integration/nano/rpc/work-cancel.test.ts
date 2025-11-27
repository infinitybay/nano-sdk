import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

// Requires enable_control to be enabled
xdescribe("work_cancel RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("cancels work generation", async () => {
    const result = await Nano.RPC.Safe.work_cancel(
      rpcUrl,
      {
        action: "work_cancel",
        hash: TestData.StateBlockHash(),
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
