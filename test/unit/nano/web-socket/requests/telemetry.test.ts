import { TelemetryRequest } from "../../../../../src/nano/web-socket/requests/telemetry";
import { assert } from "../../../../assert";

describe("TelemetryRequest schema", () => {
  test("validates telemetry request", () => {
    const result = TelemetryRequest().safeParse({ action: "subscribe", topic: "telemetry", ack: "true" });
    assert(result.success);
  });

  test("rejects telemetry request with invalid topic", () => {
    const result = TelemetryRequest().safeParse({ action: "subscribe", topic: "work" });
    assert(!result.success);
  });
});
