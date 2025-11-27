import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("work_validate RPC integration", () => {
  test("validates work value", async () => {
    const result = await Nano.RPC.Safe.work_validate(
      rpcUrl,
      {
        action: "work_validate",
        work: TestData.StateBlock().work,
        hash: TestData.KeySet().PublicKey(),
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.valid_all).toBe("1");
    expect(result.data.valid_receive).toBe("1");
  });
});
