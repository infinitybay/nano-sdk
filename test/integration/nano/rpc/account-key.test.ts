import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_key RPC integration", () => {
  test("returns public key for account", async () => {
    const result = await Nano.RPC.Safe.account_key(
      rpcUrl,
      {
        action: "account_key",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.key).toBe(TestData.GenesisPublicKey());
  });
});
