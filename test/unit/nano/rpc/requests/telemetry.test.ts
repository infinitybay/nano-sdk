import { TelemetryRequest } from "../../../../../src/nano/rpc/requests/telemetry";

describe("TelemetryRequest schema", () => {
  test("validates telemetry request with optional address and port", () => {
    const result = TelemetryRequest().safeParse({
      action: "telemetry",
      address: "127.0.0.1",
      port: 7075,
      raw: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects telemetry request with out of range port", () => {
    const result = TelemetryRequest().safeParse({
      action: "telemetry",
      port: 70000,
    });
    expect(result.success).toBe(false);
  });
});
