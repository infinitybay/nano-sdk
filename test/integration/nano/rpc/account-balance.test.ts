import { Nano } from "../../../../src";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_balance RPC integration", () => {
  test("returns balances for an account", async () => {
    const result = await Nano.RPC.account_balance(
      rpcUrl,
      {
        action: "account_balance",
        account: TestData.GenesisAccount(),
        include_only_confirmed: true,
      },
      rpcRequestConfig
    );
    expect(result.success).toBe(true);
  });
});
