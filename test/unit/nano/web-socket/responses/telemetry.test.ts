import { TelemetryResponse } from "../../../../../src/nano/web-socket/responses/telemetry";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

const telemetryMessageV1 = () => ({
  block_count: "1",
  cemented_count: "2",
  unchecked_count: "3",
  account_count: "4",
  bandwidth_cap: "5",
  peer_count: "6",
  protocol_version: "7",
  uptime: TestData.Valid.Timestamp2(),
  genesis_block: TestData.Valid.Hash1(),
  major_version: "29",
  minor_version: "0",
  patch_version: "0",
  pre_release_version: "0",
  maker: "nf_node",
  timestamp: TestData.Valid.Timestamp3(),
  active_difficulty: TestData.Valid.WorkDifficulty1(),
  node_id: TestData.Valid.NodeId1(),
  signature: TestData.Valid.Signature1(),
  address: "127.0.0.1",
  port: "7076",
});

const telemetryMessageV2 = () => ({
  ...telemetryMessageV1(),
  database_backend: "lmdb",
  confirmation_latency_ms_p50: "254",
  confirmation_latency_ms_p90: "510",
  confirmation_latency_ms_p99: "1205",
  bootstrap_status: "synced",
});

const telemetryResponse = (message: Record<string, unknown>) => ({
  topic: "telemetry",
  time: TestData.Valid.Timestamp1(),
  message,
});

describe("TelemetryResponse schema", () => {
  test("validates telemetry-v1 response without telemetry-v2 fields", () => {
    const result = TelemetryResponse().safeParse(telemetryResponse(telemetryMessageV1()));
    assert(result.success);
    expect(result.data.message.maker).toBe("nf_node");
    expect("database_backend" in result.data.message).toBe(false);
  });

  test("validates telemetry-v2 response", () => {
    const result = TelemetryResponse().safeParse(telemetryResponse(telemetryMessageV2()));
    assert(result.success);
    assert("database_backend" in result.data.message);
    expect(result.data.message).toMatchObject({
      database_backend: "lmdb",
      confirmation_latency_ms_p50: "254",
      confirmation_latency_ms_p90: "510",
      confirmation_latency_ms_p99: "1205",
      bootstrap_status: "synced",
    });
  });

  test("rejects telemetry response with partial telemetry-v2 fields", () => {
    const result = TelemetryResponse().safeParse(
      telemetryResponse({
        ...telemetryMessageV1(),
        database_backend: "lmdb",
      })
    );
    expect(result.success).toBe(false);
  });

  test("rejects telemetry response with invalid port", () => {
    const result = TelemetryResponse().safeParse(
      telemetryResponse({
        ...telemetryMessageV1(),
        port: "99999",
      })
    );
    expect(result.success).toBe(false);
  });
});
