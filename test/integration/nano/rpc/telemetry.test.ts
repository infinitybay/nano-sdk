import { Nano } from "../../../../src";
import { assert } from "../../../assert";
import { rpcRequestConfig, rpcUrl } from "../../config";
import { TestData } from "../../test-data";

describe("telemetry RPC integration", () => {
  test("returns telemetry metrics", async () => {
    const result = await Nano.RPC.telemetry(
      rpcUrl,
      {
        action: "telemetry",
      },
      rpcRequestConfig
    );
    assert(result.success);
    expect(result.data.genesis_block).toBe(TestData.GenesisBlockHash());
  });

  test("returns telemetry metrics from all peers", async () => {
    const result = await Nano.RPC.telemetry(
      rpcUrl,
      {
        action: "telemetry",
        raw: true,
      },
      rpcRequestConfig
    );
    assert(result.success);
    assert(result.data.metrics);
    expect(result.data.metrics.length).toBeGreaterThan(0);
  });

  test("returns telemetry metrics from a specific peer", async () => {
    const result1 = await Nano.RPC.telemetry(
      rpcUrl,
      {
        action: "telemetry",
        raw: true,
      },
      rpcRequestConfig
    );
    assert(result1.success);
    assert(result1.data.metrics);
    expect(result1.data.metrics.length).toBeGreaterThan(0);

    const result2 = await Nano.RPC.telemetry(
      rpcUrl,
      {
        action: "telemetry",
        address: result1.data.metrics[0].address,
        port: result1.data.metrics[0].port,
      },
      rpcRequestConfig
    );
    assert(result2.success);
    expect(result2.data.genesis_block).toBe(TestData.GenesisBlockHash());
  });
});
