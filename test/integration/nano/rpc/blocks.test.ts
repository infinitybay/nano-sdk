import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("blocks RPC integration", () => {
  test("returns blocks as strings", async () => {
    const result = await Nano.RPC.Safe.blocks(
      rpcUrl,
      {
        action: "blocks",
        hashes: [TestData.GenesisBlockHash()],
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(JSON.parse(result.data.blocks[TestData.GenesisBlockHash()])).toStrictEqual(TestData.GenesisBlock());
  });

  test("returns blocks as JSON objects", async () => {
    const result = await Nano.RPC.Safe.blocks(
      rpcUrl,
      {
        action: "blocks",
        hashes: [TestData.GenesisBlockHash()],
        json_block: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()]).toStrictEqual(TestData.GenesisBlock());
  });
});
