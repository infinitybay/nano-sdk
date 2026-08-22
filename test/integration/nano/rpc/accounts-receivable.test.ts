import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("accounts_receivable RPC integration", () => {
  test("returns pending blocks for accounts", async () => {
    const result = await Nano.RPC.accounts_receivable(
      rpcUrl,
      {
        action: "accounts_receivable",
        accounts: [TestData.BurnAccount()],
        count: 5,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.BurnAccount());
    expect(result.data.blocks[TestData.BurnAccount()]).toHaveLength(5);
  });

  test("returns pending blocks for accounts", async () => {
    const result = await Nano.RPC.accounts_receivable(
      rpcUrl,
      {
        action: "accounts_receivable",
        accounts: [TestData.BurnAccount()],
        count: 5,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.BurnAccount());
    expect(result.data.blocks[TestData.BurnAccount()]).toHaveLength(5);
  });

  test("returns pending blocks with source accounts included", async () => {
    const result = await Nano.RPC.accounts_receivable(
      rpcUrl,
      {
        action: "accounts_receivable",
        accounts: [TestData.BurnAccount()],
        count: 5,
        source: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.BurnAccount());
    expect(Object.keys(result.data.blocks[TestData.BurnAccount()])).toHaveLength(5);
    expect(
      result.data.blocks[TestData.BurnAccount()][Object.keys(result.data.blocks[TestData.BurnAccount()])[0]].amount
    ).toBeDefined();
    expect(
      result.data.blocks[TestData.BurnAccount()][Object.keys(result.data.blocks[TestData.BurnAccount()])[0]].source
    ).toBeDefined();
  });

  test("returns pending blocks filtered by threshold", async () => {
    const result = await Nano.RPC.accounts_receivable(
      rpcUrl,
      {
        action: "accounts_receivable",
        accounts: [TestData.BurnAccount()],
        count: 5,
        threshold: "1",
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.BurnAccount());
    expect(Object.keys(result.data.blocks[TestData.BurnAccount()])).toHaveLength(5);
  });

  test("returns sorted pending blocks with amounts", async () => {
    const result = await Nano.RPC.accounts_receivable(
      rpcUrl,
      {
        action: "accounts_receivable",
        accounts: [TestData.GenesisAccount()],
        count: 5,
        sorting: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveProperty(TestData.GenesisAccount());
    expect(Object.keys(result.data.blocks[TestData.GenesisAccount()])).toHaveLength(5);
    const amountResult = Nano.Types.RawAmountString().safeParse(
      result.data.blocks[TestData.GenesisAccount()][Object.keys(result.data.blocks[TestData.GenesisAccount()])[0]]
    );
    assert(amountResult.success);
  });
});
