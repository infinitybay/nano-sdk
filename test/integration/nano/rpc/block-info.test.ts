import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("block_info RPC integration", () => {
  test("returns block info with defaults", async () => {
    const result = await Nano.RPC.Safe.block_info(
      rpcUrl,
      {
        action: "block_info",
        hash: TestData.GenesisBlockHash(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.block_account).toBe(TestData.GenesisAccount());
    expect(result.data.contents.length).toBeGreaterThan(0);
  });

  test("returns block info including linked account", async () => {
    const result = await Nano.RPC.Safe.block_info(
      rpcUrl,
      {
        action: "block_info",
        hash: TestData.GenesisBlockHash(),
        include_linked_account: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.block_account).toBe(TestData.GenesisAccount());
    expect(result.data.contents.length).toBeGreaterThan(0);
    expect(result.data.linked_account).toBe("0");
  });

  test("returns block info as JSON block", async () => {
    const result = await Nano.RPC.Safe.block_info(
      rpcUrl,
      {
        action: "block_info",
        hash: TestData.GenesisBlockHash(),
        json_block: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.block_account).toBe(TestData.GenesisAccount());
    assert(result.data.contents.type === "open");
    expect(result.data.contents.account).toBe(TestData.GenesisAccount());
  });

  test("returns JSON block info including linked account", async () => {
    const result = await Nano.RPC.Safe.block_info(
      rpcUrl,
      {
        action: "block_info",
        hash: TestData.GenesisBlockHash(),
        include_linked_account: true,
        json_block: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.block_account).toBe(TestData.GenesisAccount());
    assert(result.data.contents.type === "open");
    expect(result.data.contents.account).toBe(TestData.GenesisAccount());
    expect(result.data.linked_account).toBe("0");
  });
});
