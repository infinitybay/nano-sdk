import { Nano } from "../../../../src";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_block_count RPC integration", () => {
  test("returns the number of blocks for an account", async () => {
    const result = await Nano.RPC.Safe.account_block_count(
      rpcUrl,
      {
        action: "account_block_count",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    expect(result.success).toBe(true);
  });
});
