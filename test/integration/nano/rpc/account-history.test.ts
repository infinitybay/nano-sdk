import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("account_history RPC integration", () => {
  test("returns account history with default options", async () => {
    const result = await Nano.RPC.account_history(
      rpcUrl,
      {
        action: "account_history",
        account: TestData.GenesisAccount(),
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
    assert(result.data.history);
    expect(result.data.history.length).toBe(3);
    expect(result.data.history[0].topo_height).toMatch(/^(0|[1-9]\d*)$/);
    expect(result.data.previous).toBeTruthy();
  });

  test("returns account history starting from head", async () => {
    const result = await Nano.RPC.account_history(
      rpcUrl,
      {
        action: "account_history",
        count: 1,
        head: TestData.GenesisBlockHash(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
    assert(result.data.history);
    expect(result.data.history).toHaveLength(1);
    expect(result.data.history[0].hash).toBe(TestData.GenesisBlockHash());
  });

  test("returns account history including linked accounts", async () => {
    const result = await Nano.RPC.account_history(
      rpcUrl,
      {
        action: "account_history",
        account: TestData.GenesisAccount(),
        count: 3,
        include_linked_account: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
    assert(result.data.history);
    expect(result.data.history.length).toBe(3);
    expect(result.data.history[0].linked_account).toBeTruthy();
    expect(result.data.previous).toBeTruthy();
  });

  test("returns raw account history entries", async () => {
    const result = await Nano.RPC.account_history(
      rpcUrl,
      {
        action: "account_history",
        account: TestData.GenesisAccount(),
        count: 3,
        raw: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
    assert(result.data.history);
    expect(result.data.history.length).toBe(3);
    expect(result.data.history[0].topo_height).toMatch(/^(0|[1-9]\d*)$/);
    expect(result.data.previous).toBeTruthy();
  });

  test("returns account history in reverse order", async () => {
    const result = await Nano.RPC.account_history(
      rpcUrl,
      {
        action: "account_history",
        account: TestData.GenesisAccount(),
        count: 3,
        reverse: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.GenesisAccount());
    assert(result.data.history);
    expect(result.data.history.length).toBe(3);
    expect(result.data.next).toBeTruthy();
  });
});
