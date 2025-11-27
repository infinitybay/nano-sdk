import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("accounts_balances RPC integration", () => {
  test("returns balances for multiple accounts", async () => {
    const result = await Nano.RPC.Safe.accounts_balances(
      rpcUrl,
      {
        action: "accounts_balances",
        accounts: [TestData.GenesisAccount()],
        include_only_confirmed: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.balances);
    expect(result.data.balances).toHaveProperty(TestData.GenesisAccount());
  });
});
