import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";

describe("peers RPC integration", () => {
  test("returns peers", async () => {
    const result = await Nano.RPC.peers(
      rpcUrl,
      {
        action: "peers",
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.peers);
    expect(Object.keys(result.data.peers).length).toBeGreaterThan(0);
  });

  test("returns peer details", async () => {
    const result = await Nano.RPC.peers(
      rpcUrl,
      {
        action: "peers",
        peer_details: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.peers);
    expect(Object.keys(result.data.peers).length).toBeGreaterThan(0);
    expect(result.data.peers[Object.keys(result.data.peers)[0]].protocol_version).toBeDefined();
  });
});
