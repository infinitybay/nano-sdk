import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

// Requires enable_control to be enabled
xdescribe("unopened RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("returns unopened accounts", async () => {
    const result = await Nano.RPC.Safe.unopened(
      rpcUrl,
      {
        action: "unopened",
        account: TestData.BurnAccount(),
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
  });

  xtest("returns unopened accounts above threshold", async () => {
    const result = await Nano.RPC.Safe.unopened(
      rpcUrl,
      {
        action: "unopened",
        account: TestData.BurnAccount(),
        count: 3,
        threshold: "1",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
