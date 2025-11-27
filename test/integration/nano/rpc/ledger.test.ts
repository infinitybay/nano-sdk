import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

// Requires enable_control to be enabled
xdescribe("ledger RPC integration", () => {
  xtest("disabled", async () => {});

  xtest("returns ledger entries with defaults", async () => {
    const result = await Nano.RPC.Safe.ledger(
      rpcUrl,
      {
        action: "ledger",
        account: TestData.GenesisAccount(),
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.accounts);
  });

  xtest("returns ledger entries including representatives", async () => {
    const result = await Nano.RPC.Safe.ledger(
      rpcUrl,
      {
        action: "ledger",
        account: TestData.GenesisAccount(),
        count: 3,
        representative: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.accounts);
    expect(Object.keys(result.data.accounts).length).toBeGreaterThan(0);
    expect(result.data.accounts[Object.keys(result.data.accounts)[0]].representative).toBeTruthy();
  });

  xtest("returns ledger entries including weights", async () => {
    const result = await Nano.RPC.Safe.ledger(
      rpcUrl,
      {
        action: "ledger",
        account: TestData.GenesisAccount(),
        count: 3,
        weight: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.accounts);
    expect(result.data.accounts[Object.keys(result.data.accounts)[0]].weight).toBeTruthy();
  });

  xtest("returns ledger entries including receivable amounts", async () => {
    const result = await Nano.RPC.Safe.ledger(
      rpcUrl,
      {
        action: "ledger",
        account: TestData.GenesisAccount(),
        count: 3,
        receivable: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.accounts);
    expect(result.data.accounts[Object.keys(result.data.accounts)[0]].receivable).toBeTruthy();
  });
});
