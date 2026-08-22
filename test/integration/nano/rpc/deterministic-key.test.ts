import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("deterministic_key RPC integration", () => {
  test("derives deterministic key", async () => {
    const result = await Nano.RPC.deterministic_key(
      rpcUrl,
      {
        action: "deterministic_key",
        seed: TestData.KeySet().Seed(),
        index: TestData.KeySet().SeedIndex().toString(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.account).toBe(TestData.KeySet().Account());
    expect(result.data.private).toBe(TestData.KeySet().PrivateKey());
    expect(result.data.public).toBe(TestData.KeySet().PublicKey());
  });
});
