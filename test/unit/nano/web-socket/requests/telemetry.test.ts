import { TelemetryRequest } from "../../../../../src/nano/web-socket/requests/telemetry";

describe("TelemetryRequest schema", () => {
  test("validates telemetry request", () => {
    const result = TelemetryRequest().safeParse({ action: "subscribe", topic: "telemetry", ack: "true" });
    expect(result.success).toBe(true);
  });

  test("rejects telemetry request with invalid topic", () => {
    const result = TelemetryRequest().safeParse({ action: "subscribe", topic: "work" });
    expect(result.success).toBe(false);
  });
});
