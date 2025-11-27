import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("confirmation_history RPC integration", () => {
  test("returns confirmation history", async () => {
    const result = await Nano.RPC.Safe.confirmation_history(
      rpcUrl,
      {
        action: "confirmation_history",
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
