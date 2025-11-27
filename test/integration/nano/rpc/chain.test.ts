import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("chain RPC integration", () => {
  test("returns a block chain from starting hash", async () => {
    const result = await Nano.RPC.Safe.chain(
      rpcUrl,
      {
        action: "chain",
        block: TestData.GenesisBlockHash(),
        count: 1,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveLength(1);
    expect(result.data.blocks[0]).toBe(TestData.GenesisBlockHash());
  });

  test("returns a block chain from starting hash reverse", async () => {
    const result = await Nano.RPC.Safe.chain(
      rpcUrl,
      {
        action: "chain",
        block: TestData.GenesisBlockHash(),
        count: 3,
        reverse: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveLength(3);
    expect(result.data.blocks[0]).toBe(TestData.GenesisBlockHash());
  });
});
