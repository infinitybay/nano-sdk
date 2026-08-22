import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

const MAX_WHOLE_NANO_AMOUNT = 340282366;

describe("nano_to_raw RPC integration", () => {
  test.each(["1", 1])("converts Nano amount %p to raw", async (amount) => {
    const result = await Nano.RPC.nano_to_raw(
      rpcUrl,
      {
        action: "nano_to_raw",
        amount,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.amount).toBe("1000000000000000000000000000000");
  });

  test.each([0, MAX_WHOLE_NANO_AMOUNT + 1])("rejects out-of-range numeric amount %s", async (amount) => {
    const result = await Nano.RPC.nano_to_raw(rpcUrl, { action: "nano_to_raw", amount }, rpcRequestConfig);
    assert(!result.success);
    expect(result.error.code).toBe(Nano.RPC.ErrorCode.InvalidRequest);
  });

  test("converts the maximum overflow-safe amount to raw", async () => {
    const result = await Nano.RPC.nano_to_raw(
      rpcUrl,
      {
        action: "nano_to_raw",
        amount: MAX_WHOLE_NANO_AMOUNT,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.amount).toBe("340282366000000000000000000000000000000");
  });
});
