import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("uptime RPC integration", () => {
  test("returns node uptime", async () => {
    const result = await Nano.RPC.Safe.uptime(
      rpcUrl,
      {
        action: "uptime",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.seconds).toBeTruthy();
  });
});
