import { TelemetryResponse } from "../../../../../src/nano/rpc/responses/telemetry";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

const telemetryMetricsV1 = () => ({
  block_count: "214104699",
  cemented_count: "214104699",
  unchecked_count: "5931",
  account_count: "37186911",
  bandwidth_cap: "37500000",
  peer_count: "175",
  protocol_version: "21",
  uptime: "4897421",
  genesis_block: TestData.Valid.Hash1(),
  major_version: "29",
  minor_version: "0",
  patch_version: "0",
  pre_release_version: "0",
  maker: "nf_node",
  timestamp: TestData.Valid.Timestamp1(),
  active_difficulty: TestData.Valid.WorkDifficulty1(),
  node_id: TestData.Valid.NodeId1(),
  signature: TestData.Valid.Signature1(),
});

const telemetryMetricsV2 = () => ({
  ...telemetryMetricsV1(),
  database_backend: "lmdb",
  confirmation_latency_ms_p50: "254",
  confirmation_latency_ms_p90: "510",
  confirmation_latency_ms_p99: "1205",
  bootstrap_status: "synced",
});

describe("TelemetryResponse schema", () => {
  test("parses telemetry-v2 metrics when all options are disabled", () => {
    const schema = TelemetryResponse({ address: false, port: false, raw: false });
    const result = schema.safeParse(telemetryMetricsV2());
    assert(result.success);
    assert("database_backend" in result.data);
    expect(result.data.database_backend).toBe("lmdb");
    expect(result.data.confirmation_latency_ms_p50).toBe("254");
    expect(result.data.confirmation_latency_ms_p90).toBe("510");
    expect(result.data.confirmation_latency_ms_p99).toBe("1205");
    expect(result.data.bootstrap_status).toBe("synced");
  });

  test("parses telemetry-v1 peer metrics without telemetry-v2 fields", () => {
    const schema = TelemetryResponse({ address: true, port: true, raw: false });
    const result = schema.safeParse(telemetryMetricsV1());
    assert(result.success);
    expect(result.data.maker).toBe("nf_node");
    expect("database_backend" in result.data).toBe(false);
  });

  test("parses telemetry-v2 metrics array when raw is true", () => {
    const schema = TelemetryResponse({ address: false, port: false, raw: true });
    const result = schema.safeParse({
      metrics: [
        {
          ...telemetryMetricsV2(),
          address: "::ffff:1.1.1.1",
          port: "7075",
        },
      ],
    });
    assert(result.success);
    assert(result.data.metrics);
    expect(result.data.metrics[0]).toMatchObject({
      database_backend: "lmdb",
      confirmation_latency_ms_p50: "254",
      confirmation_latency_ms_p90: "510",
      confirmation_latency_ms_p99: "1205",
      bootstrap_status: "synced",
    });
  });

  test.each(["nf_node", "nf_pruned_node", "nf_peering_node", "rs_nano", "invalid"])("parses v29 maker %s", (maker) => {
    const schema = TelemetryResponse({ address: false, port: false, raw: false });
    const result = schema.safeParse({ ...telemetryMetricsV2(), maker });
    assert(result.success);
    expect(result.data.maker).toBe(maker);
  });

  test("rejects a partial telemetry-v2 extension", () => {
    const schema = TelemetryResponse({ address: false, port: false, raw: false });
    const result = schema.safeParse({ ...telemetryMetricsV1(), database_backend: "lmdb" });
    expect(result.success).toBe(false);
  });

  test("parses telemetry error when address flag mismatches port flag", () => {
    const schema = TelemetryResponse({ address: true, port: false, raw: false });
    const result = schema.safeParse({ error: "mismatch" });
    assert(result.success);

    const schema2 = TelemetryResponse({ address: false, port: true, raw: false });
    const result2 = schema2.safeParse({ error: "mismatch" });
    assert(result2.success);
  });
});
