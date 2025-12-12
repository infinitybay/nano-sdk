import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("representatives_online RPC integration", () => {
  test("returns online representatives", async () => {
    const result = await Nano.RPC.representatives_online(
      rpcUrl,
      {
        action: "representatives_online",
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.representatives);
    expect(result.data.representatives.length).toBeGreaterThan(0);
  });

  test("returns online representatives with weight", async () => {
    const result = await Nano.RPC.representatives_online(
      rpcUrl,
      {
        action: "representatives_online",
        weight: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.representatives);
    expect(Object.keys(result.data.representatives).length).toBeGreaterThan(0);
    expect(result.data.representatives[Object.keys(result.data.representatives)[0]].weight).toBeTruthy();
  });
});
