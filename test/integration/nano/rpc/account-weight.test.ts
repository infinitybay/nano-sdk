import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_weight RPC integration", () => {
  test("returns voting weight for account", async () => {
    const result = await Nano.RPC.Safe.account_weight(
      rpcUrl,
      {
        action: "account_weight",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.weight).toBeDefined();
  });
});
