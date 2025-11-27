import { PingRequest } from "../../../../../src/nano/web-socket/requests/ping";

describe("PingRequest schema", () => {
  test("validates ping action with optional ack flag", () => {
    const result = PingRequest().safeParse({ action: "ping", ack: false, id: "123" });
    expect(result.success).toBe(true);
  });

  test("rejects ping request with non-ping action", () => {
    const result = PingRequest().safeParse({ action: "subscribe" });
    expect(result.success).toBe(false);
  });
});
