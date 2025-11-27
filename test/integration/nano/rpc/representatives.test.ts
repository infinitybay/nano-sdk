import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("representatives RPC integration", () => {
  test("returns representatives", async () => {
    const result = await Nano.RPC.Safe.representatives(
      rpcUrl,
      {
        action: "representatives",
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.representatives);
    expect(Object.keys(result.data.representatives).length).toBeGreaterThan(0);
    expect(result.data.representatives[Object.keys(result.data.representatives)[0]]).toBeTruthy();
  });
});
