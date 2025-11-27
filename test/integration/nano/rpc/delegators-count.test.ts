import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

// Disabled: This RPC is skipped for performance reasons.
xdescribe("delegators_count RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("returns delegators count for account", async () => {
    const result = await Nano.RPC.Safe.delegators_count(
      rpcUrl,
      {
        action: "delegators_count",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
