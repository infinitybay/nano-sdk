import { Nano } from "../../../../src";
import { HashStrings } from "../../../../src/nano/types";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("blocks_info RPC integration", () => {
  test("returns block info with defaults", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash()],
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    expect(result.data.blocks[TestData.GenesisBlockHash()].topo_height).toMatch(/^(0|[1-9]\d*)$/);
    expect(result.data.blocks[TestData.GenesisBlockHash()].contents.length).toBeGreaterThan(0);
  });

  test("returns block info including linked accounts", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash()],
        include_linked_account: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    expect(result.data.blocks[TestData.GenesisBlockHash()].linked_account).toBe("0");
  });

  test("returns block info including not found entries", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash(), HashStrings.zero()],
        include_not_found: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    assert(result.data.blocks_not_found);
    expect(result.data.blocks_not_found).toHaveLength(1);
    expect(result.data.blocks_not_found[0]).toBe(HashStrings.zero());
  });

  test("returns block info as JSON blocks", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash()],
        json_block: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    const contents = result.data.blocks[TestData.GenesisBlockHash()].contents;
    assert(contents.type === "open");
    expect(contents.account).toBe(TestData.GenesisAccount());
  });

  test("returns block info including receivable state", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash()],
        receivable: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    expect(result.data.blocks[TestData.GenesisBlockHash()].receivable).toBe("0");
  });

  test("returns block info including receive hash", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash()],
        receive_hash: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    expect(result.data.blocks[TestData.GenesisBlockHash()].receive_hash).toBe(HashStrings.zero());
  });

  test("returns block info including source", async () => {
    const result = await Nano.RPC.blocks_info(
      rpcUrl,
      {
        action: "blocks_info",
        hashes: [TestData.GenesisBlockHash()],
        source: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisBlockHash());
    expect(result.data.blocks[TestData.GenesisBlockHash()].block_account).toBe(TestData.GenesisAccount());
    expect(result.data.blocks[TestData.GenesisBlockHash()].source_account).toBe("0");
  });
});
