import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("frontiers RPC integration", () => {
  test("returns frontiers for an account", async () => {
    const result = await Nano.RPC.Safe.frontiers(
      rpcUrl,
      {
        action: "frontiers",
        account: TestData.GenesisAccount(),
        count: 3,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(Object.keys(result.data.frontiers)).toHaveLength(3);
    expect(result.data.frontiers).toHaveProperty(TestData.GenesisAccount());
  });
});
