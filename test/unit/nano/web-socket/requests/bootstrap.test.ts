import { BootstrapRequest } from "../../../../../src/nano/web-socket/requests/bootstrap";

describe("BootstrapRequest schema", () => {
  test("validates bootstrap request", () => {
    const result = BootstrapRequest().safeParse({ action: "subscribe", topic: "bootstrap", ack: true, id: "1" });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap request with invalid action", () => {
    const result = BootstrapRequest().safeParse({ action: "ping", topic: "bootstrap" });
    expect(result.success).toBe(false);
  });
});
