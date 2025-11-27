import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("raw_to_nano RPC integration", () => {
  test("converts raw amount to Nano", async () => {
    const result = await Nano.RPC.Safe.raw_to_nano(
      rpcUrl,
      {
        action: "raw_to_nano",
        amount: "1000000000000000000000000000000",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.amount).toBe("1");
  });
});
