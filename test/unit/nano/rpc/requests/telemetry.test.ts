import { TelemetryRequest } from "../../../../../src/nano/rpc/requests/telemetry";
import { assert } from "../../../../assert";

describe("TelemetryRequest schema", () => {
  test("validates telemetry request with optional address and port", () => {
    const result = TelemetryRequest().safeParse({
      action: "telemetry",
      address: "127.0.0.1",
      port: 7075,
      raw: true,
    });
    assert(result.success);
  });

  test("rejects telemetry request with out of range port", () => {
    const result = TelemetryRequest().safeParse({
      action: "telemetry",
      port: 70000,
    });
    assert(!result.success);
  });
});
