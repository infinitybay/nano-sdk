import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("nano_to_raw RPC integration", () => {
  test("converts Nano amount to raw", async () => {
    const result = await Nano.RPC.Safe.nano_to_raw(
      rpcUrl,
      {
        action: "nano_to_raw",
        amount: "1",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.amount).toBe("1000000000000000000000000000000");
  });
});
