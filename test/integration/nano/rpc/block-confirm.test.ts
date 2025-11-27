import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("block_confirm RPC integration", () => {
  test("requests block confirmation", async () => {
    const result = await Nano.RPC.Safe.block_confirm(
      rpcUrl,
      {
        action: "block_confirm",
        hash: TestData.GenesisBlockHash(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.started).toBe("1");
  });
});
