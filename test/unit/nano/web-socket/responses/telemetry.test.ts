import { TelemetryResponse } from "../../../../../src/nano/web-socket/responses/telemetry";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("TelemetryResponse schema", () => {
  test("validates telemetry response", () => {
    const result = TelemetryResponse().safeParse({
      topic: "telemetry",
      time: TestData.Valid.Timestamp1(),
      message: {
        block_count: "1",
        cemented_count: "2",
        unchecked_count: "3",
        account_count: "4",
        bandwidth_cap: "5",
        peer_count: "6",
        protocol_version: "7",
        uptime: TestData.Valid.Timestamp2(),
        genesis_block: TestData.Valid.Hash1(),
        major_version: "1",
        minor_version: "0",
        patch_version: "0",
        pre_release_version: "0",
        maker: "1",
        timestamp: TestData.Valid.Timestamp3(),
        active_difficulty: TestData.Valid.WorkDifficulty1(),
        node_id: TestData.Valid.NodeId1(),
        signature: TestData.Valid.Signature1(),
        address: "127.0.0.1",
        port: "7076",
      },
    });
    assert(result.success);
  });

  test("rejects telemetry response with invalid port", () => {
    const result = TelemetryResponse().safeParse({
      topic: "telemetry",
      time: TestData.Valid.Timestamp1(),
      message: {
        block_count: "1",
        cemented_count: "2",
        unchecked_count: "3",
        account_count: "4",
        bandwidth_cap: "5",
        peer_count: "6",
        protocol_version: "7",
        uptime: TestData.Valid.Timestamp2(),
        genesis_block: TestData.Valid.Hash1(),
        major_version: "1",
        minor_version: "0",
        patch_version: "0",
        pre_release_version: "0",
        maker: "1",
        timestamp: TestData.Valid.Timestamp3(),
        active_difficulty: TestData.Valid.WorkDifficulty1(),
        node_id: TestData.Valid.NodeId1(),
        signature: TestData.Valid.Signature1(),
        address: "127.0.0.1",
        port: "99999",
      },
    });
    assert(!result.success);
  });
});
