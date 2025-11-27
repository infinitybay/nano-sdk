import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("confirmation_active RPC integration", () => {
  test("lists active confirmations", async () => {
    const result = await Nano.RPC.Safe.confirmation_active(
      rpcUrl,
      {
        action: "confirmation_active",
        announcements: 1,
      },
      rpcRequestConfig
    );
    assert(result.success);
  });
});
