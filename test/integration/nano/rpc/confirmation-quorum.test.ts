import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("confirmation_quorum RPC integration", () => {
  test("returns quorum information", async () => {
    const result = await Nano.RPC.confirmation_quorum(
      rpcUrl,
      {
        action: "confirmation_quorum",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(Number(result.data.online_weight_quorum_percent)).toBe(67);
  });

  test("returns quorum information with peer details", async () => {
    const result = await Nano.RPC.confirmation_quorum(
      rpcUrl,
      {
        action: "confirmation_quorum",
        peer_details: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.peers.length).toBeGreaterThan(0);
  });
});
