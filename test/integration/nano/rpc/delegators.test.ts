import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

// Disabled: This RPC is skipped for performance reasons.
xdescribe("delegators RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("returns delegators for account", async () => {
    const result = await Nano.RPC.Safe.delegators(
      rpcUrl,
      {
        action: "delegators",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
  });

  xtest("returns delegators over threshold", async () => {
    const result = await Nano.RPC.Safe.delegators(
      rpcUrl,
      {
        action: "delegators",
        account: TestData.GenesisAccount(),
        threshold: "1000000000000000000000000000000000",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
