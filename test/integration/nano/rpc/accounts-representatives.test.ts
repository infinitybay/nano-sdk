import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("accounts_representatives RPC integration", () => {
  test("returns representatives for accounts", async () => {
    const result = await Nano.RPC.Safe.accounts_representatives(
      rpcUrl,
      {
        action: "accounts_representatives",
        accounts: [TestData.GenesisAccount()],
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.representatives);
    expect(result.data.representatives).toHaveProperty(TestData.GenesisAccount());
    expect(result.data.representatives[TestData.GenesisAccount()]).toBe(TestData.GenesisAccount());
  });
});
