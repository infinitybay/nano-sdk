import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

// Requires enable_control to be enabled
xdescribe("work_generate RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("generates work for hash", async () => {
    const result = await Nano.RPC.work_generate(
      rpcUrl,
      {
        action: "work_generate",
        hash: TestData.StateBlockHash(),
        json_block: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
