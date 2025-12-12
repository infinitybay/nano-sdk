import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("block_account RPC integration", () => {
  test("returns account for block hash", async () => {
    const result = await Nano.RPC.block_account(
      rpcUrl,
      {
        action: "block_account",
        hash: TestData.GenesisBlockHash(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
  });
});
