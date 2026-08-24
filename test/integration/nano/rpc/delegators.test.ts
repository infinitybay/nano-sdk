import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { describeWithExtendedLedger } from "../../../describe";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

function expectWeightAndAccountDescending(delegators: Record<string, string>) {
  const entries = Object.entries(delegators);
  for (let i = 1; i < entries.length; i++) {
    const [previousAccount, previousWeight] = entries[i - 1];
    const [account, weight] = entries[i];
    const previousWeightValue = BigInt(previousWeight);
    const weightValue = BigInt(weight);

    expect(
      previousWeightValue > weightValue || (previousWeightValue === weightValue && previousAccount > account)
    ).toBe(true);
  }
}

describeWithExtendedLedger("delegators RPC integration with extended ledger", () => {
  test("returns delegators in descending weight and account order", async () => {
    const result = await Nano.RPC.delegators(
      rpcUrl,
      {
        action: "delegators",
        account: TestData.GenesisAccount(),
        count: 25,
      },
      rpcRequestConfig
    );
    assert(result.success, JSON.stringify(result));
    expect(result.data.delegators).not.toBe("");
    if (result.data.delegators !== "") {
      expectWeightAndAccountDescending(result.data.delegators);
    }
  });

  test("continues indexed pagination with the emitted cursor", async () => {
    const firstPage = await Nano.RPC.delegators(
      rpcUrl,
      {
        action: "delegators",
        account: TestData.GenesisAccount(),
        count: 1,
      },
      rpcRequestConfig
    );
    assert(firstPage.success, JSON.stringify(firstPage));
    assert(firstPage.data.delegators !== "", "Expected an indexed delegators page.");
    assert(firstPage.data.next !== undefined, "Expected an indexed delegators continuation cursor.");

    const firstEntry = Object.entries(firstPage.data.delegators)[0];
    expect(firstPage.data.next).toBe(`${firstEntry[1]}:${firstEntry[0]}`);

    const secondPage = await Nano.RPC.delegators(
      rpcUrl,
      {
        action: "delegators",
        account: TestData.GenesisAccount(),
        count: 1,
        start: firstPage.data.next,
      },
      rpcRequestConfig
    );
    assert(secondPage.success, JSON.stringify(secondPage));
    expect(secondPage.data.delegators).not.toBe("");
    if (secondPage.data.delegators !== "") {
      expect(Object.keys(secondPage.data.delegators)[0]).not.toBe(firstEntry[0]);
    }

    const accountCursorPage = await Nano.RPC.delegators(
      rpcUrl,
      {
        action: "delegators",
        account: TestData.GenesisAccount(),
        count: 1,
        start: firstEntry[0],
      },
      rpcRequestConfig
    );
    assert(accountCursorPage.success, JSON.stringify(accountCursorPage));
    expect(accountCursorPage.data).toEqual(secondPage.data);
  });
});
