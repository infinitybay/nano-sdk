import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_get RPC integration", () => {
  test("returns the account address for a public key", async () => {
    const result = await Nano.RPC.Safe.account_get(
      rpcUrl,
      {
        action: "account_get",
        key: TestData.GenesisPublicKey(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
  });
});
