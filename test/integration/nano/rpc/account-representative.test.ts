import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_representative RPC integration", () => {
  test("returns representative for account", async () => {
    const result = await Nano.RPC.Safe.account_representative(
      rpcUrl,
      {
        action: "account_representative",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.representative).toBe(TestData.GenesisAccount());
  });
});
