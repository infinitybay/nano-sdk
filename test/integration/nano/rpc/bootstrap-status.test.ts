import { Nano } from "../../../../src";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("bootstrap_status RPC integration", () => {
  test("returns bootstrap status", async () => {
    const result = await Nano.RPC.bootstrap_status(
      rpcUrl,
      {
        action: "bootstrap_status",
      },
      rpcRequestConfig
    );
    expect(result.success).toBe(true);
  });
});
