import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("accounts_frontiers RPC integration", () => {
  test("returns frontiers for accounts", async () => {
    const result = await Nano.RPC.accounts_frontiers(
      rpcUrl,
      {
        action: "accounts_frontiers",
        accounts: [TestData.GenesisAccount()],
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.frontiers);
    expect(result.data.frontiers).toHaveProperty(TestData.GenesisAccount());
  });
});
