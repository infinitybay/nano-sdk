import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("representatives RPC integration", () => {
  test.each([
    ["unsorted", false],
    ["sorted", true],
  ])("returns exactly the requested count in %s mode", async (_mode, sorting) => {
    const result = await Nano.RPC.representatives(
      rpcUrl,
      {
        action: "representatives",
        count: 1,
        sorting,
        threshold: "0",
      },
      rpcRequestConfig
    );
    assert(result.success, JSON.stringify(result));
    expect(Object.keys(result.data.representatives)).toHaveLength(1);
  });

  test.each([
    ["unsorted", false],
    ["sorted", true],
  ])("filters representatives below the threshold in %s mode", async (_mode, sorting) => {
    const unfilteredResult = await Nano.RPC.representatives(
      rpcUrl,
      {
        action: "representatives",
        count: 1,
        sorting: true,
      },
      rpcRequestConfig
    );
    assert(unfilteredResult.success, JSON.stringify(unfilteredResult));
    assert(unfilteredResult.data.representatives !== "", "Expected at least one representative.");

    const highestWeight = Object.values(unfilteredResult.data.representatives)[0];
    const threshold = Nano.Types.RawAmountStrings.max();
    assert(BigInt(highestWeight) < BigInt(threshold), "Expected the highest representative weight below raw max.");

    const filteredResult = await Nano.RPC.representatives(
      rpcUrl,
      {
        action: "representatives",
        count: 1,
        sorting,
        threshold,
      },
      rpcRequestConfig
    );
    assert(filteredResult.success, JSON.stringify(filteredResult));
    expect(Object.keys(filteredResult.data.representatives)).toHaveLength(0);
  });
});
