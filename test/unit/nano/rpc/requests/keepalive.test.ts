import { KeepaliveRequest } from "../../../../../src/nano/rpc/requests/keepalive";

describe("KeepaliveRequest schema", () => {
  test("validates keepalive request", () => {
    const result = KeepaliveRequest().safeParse({
      action: "keepalive",
      address: "127.0.0.1",
      port: "7075",
    });
    expect(result.success).toBe(true);
  });

  test("rejects keepalive request with missing address", () => {
    const result = KeepaliveRequest().safeParse({
      action: "keepalive",
      port: "7075",
    });
    expect(result.success).toBe(false);
  });
});
