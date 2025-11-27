import { TelemetryResponse } from "../../../../../src/nano/rpc/responses/telemetry";
import { TestData } from "../../../test-data";

describe("TelemetryResponse schema", () => {
  test("parses telemetry metrics when all options are disabled", () => {
    const schema = TelemetryResponse({ address: false, port: false, raw: false });
    const result = schema.safeParse({
      block_count: "214104699",
      cemented_count: "214104699",
      unchecked_count: "5931",
      account_count: "37186911",
      bandwidth_cap: "37500000",
      peer_count: "175",
      protocol_version: "21",
      uptime: "4897421",
      genesis_block: TestData.Valid.Hash1(),
      major_version: "28",
      minor_version: "2",
      patch_version: "0",
      pre_release_version: "0",
      maker: "0",
      timestamp: TestData.Valid.Timestamp1(),
      active_difficulty: TestData.Valid.WorkDifficulty1(),
      node_id: TestData.Valid.NodeId1(),
      signature: TestData.Valid.Signature1(),
    });
    expect(result.success).toBe(true);
  });

  test("parses telemetry metrics with address and port", () => {
    const schema = TelemetryResponse({ address: true, port: true, raw: false });
    const result = schema.safeParse({
      block_count: "214104699",
      cemented_count: "214104699",
      unchecked_count: "5931",
      account_count: "37186911",
      bandwidth_cap: "37500000",
      peer_count: "175",
      protocol_version: "21",
      uptime: "4897421",
      genesis_block: TestData.Valid.Hash1(),
      major_version: "28",
      minor_version: "2",
      patch_version: "0",
      pre_release_version: "0",
      maker: "0",
      timestamp: TestData.Valid.Timestamp1(),
      active_difficulty: TestData.Valid.WorkDifficulty1(),
      node_id: TestData.Valid.NodeId1(),
      signature: TestData.Valid.Signature1(),
    });
    expect(result.success).toBe(true);
  });

  test("parses telemetry metrics array when raw is true", () => {
    const schema = TelemetryResponse({ address: false, port: false, raw: true });
    const result = schema.safeParse({
      metrics: [
        {
          block_count: "214104699",
          cemented_count: "214104699",
          unchecked_count: "5931",
          account_count: "37186911",
          bandwidth_cap: "37500000",
          peer_count: "175",
          protocol_version: "21",
          uptime: "4897421",
          genesis_block: TestData.Valid.Hash1(),
          major_version: "28",
          minor_version: "2",
          patch_version: "0",
          pre_release_version: "0",
          maker: "0",
          timestamp: TestData.Valid.Timestamp1(),
          active_difficulty: TestData.Valid.WorkDifficulty1(),
          node_id: TestData.Valid.NodeId1(),
          signature: TestData.Valid.Signature1(),
          address: "::ffff:1.1.1.1",
          port: "7075",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  test("parses telemetry error when address flag mismatches port flag", () => {
    const schema = TelemetryResponse({ address: true, port: false, raw: false });
    const result = schema.safeParse({ error: "mismatch" });
    expect(result.success).toBe(true);

    const schema2 = TelemetryResponse({ address: false, port: true, raw: false });
    const result2 = schema2.safeParse({ error: "mismatch" });
    expect(result2.success).toBe(true);
  });
});
