import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("receivable RPC integration", () => {
  test("returns receivable blocks", async () => {
    const result = await Nano.RPC.receivable(
      rpcUrl,
      {
        action: "receivable",
        account: TestData.BurnAccount(),
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(result.data.blocks).toHaveLength(3);
  });

  test("returns receivable blocks with source accounts", async () => {
    const result = await Nano.RPC.receivable(
      rpcUrl,
      {
        action: "receivable",
        account: TestData.BurnAccount(),
        count: 3,
        source: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(Object.keys(result.data.blocks)).toHaveLength(3);
    expect(result.data.blocks[Object.keys(result.data.blocks)[0]].amount).toBeTruthy();
    expect(result.data.blocks[Object.keys(result.data.blocks)[0]].source).toBeTruthy();
  });

  test("returns receivable blocks filtered by threshold", async () => {
    const result = await Nano.RPC.receivable(
      rpcUrl,
      {
        action: "receivable",
        account: TestData.BurnAccount(),
        count: 3,
        threshold: "1",
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(Object.keys(result.data.blocks)).toHaveLength(3);
    expect(result.data.blocks[Object.keys(result.data.blocks)[0]]).toBeTruthy();
  });

  test("returns sorted receivable blocks with amounts", async () => {
    const result = await Nano.RPC.receivable(
      rpcUrl,
      {
        action: "receivable",
        account: TestData.GenesisAccount(),
        count: 3,
        sorting: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(Object.keys(result.data.blocks)).toHaveLength(3);
    const amountResult = Nano.Types.RawAmountString().safeParse(result.data.blocks[Object.keys(result.data.blocks)[0]]);
    assert(amountResult.success);
  });

  test("returns receivable blocks requiring minimum version", async () => {
    const result = await Nano.RPC.receivable(
      rpcUrl,
      {
        action: "receivable",
        account: TestData.BurnAccount(),
        count: 3,
        min_version: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.blocks);
    expect(Object.keys(result.data.blocks)).toHaveLength(3);
    expect(result.data.blocks[Object.keys(result.data.blocks)[0]].amount).toBeTruthy();
    expect(result.data.blocks[Object.keys(result.data.blocks)[0]].min_version).toBeTruthy();
  });
});
