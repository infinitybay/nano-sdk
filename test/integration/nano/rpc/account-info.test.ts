import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_info RPC integration", () => {
  test("returns account info with defaults", async () => {
    const result = await Nano.RPC.Safe.account_info(
      rpcUrl,
      {
        action: "account_info",
        account: TestData.GenesisAccount(),
      },
      rpcRequestConfig
    );
    assert(result.success);
  });

  test("returns account info including representative", async () => {
    const result = await Nano.RPC.Safe.account_info(
      rpcUrl,
      {
        action: "account_info",
        account: TestData.GenesisAccount(),
        representative: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.representative).toBeDefined();
    expect(result.data.representative_block).toBeDefined();
  });

  test("returns account info including weight", async () => {
    const result = await Nano.RPC.Safe.account_info(
      rpcUrl,
      {
        action: "account_info",
        account: TestData.GenesisAccount(),
        weight: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.weight).toBeDefined();
  });

  test("returns account info including receivable", async () => {
    const result = await Nano.RPC.Safe.account_info(
      rpcUrl,
      {
        action: "account_info",
        account: TestData.GenesisAccount(),
        receivable: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.receivable).toBeDefined();
  });

  test("returns account info including confirmed balances", async () => {
    const result = await Nano.RPC.Safe.account_info(
      rpcUrl,
      {
        action: "account_info",
        account: TestData.GenesisAccount(),
        include_confirmed: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.confirmed_balance).toBeDefined();
    expect(result.data.confirmed_frontier).toBeDefined();
    expect(result.data.confirmed_height).toBeDefined();
  });
});
