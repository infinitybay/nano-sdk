import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { describeWithExtendedLedger } from "../../../describe";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describeWithExtendedLedger("delegators_count RPC integration with extended ledger", () => {
  test("returns the delegator count for an account", async () => {
    const result = await Nano.RPC.delegators_count(
      rpcUrl,
      {
        action: "delegators_count",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success, JSON.stringify(result));
    expect(BigInt(result.data.count)).toBeGreaterThan(0n);
  });
});
