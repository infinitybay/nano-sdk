import { PingRequest } from "../../../../../src/nano/web-socket/requests/ping";
import { assert } from "../../../../assert";

describe("PingRequest schema", () => {
  test("validates ping action with optional ack flag", () => {
    const result = PingRequest().safeParse({ action: "ping", ack: false, id: "123" });
    assert(result.success);
  });

  test("rejects ping request with non-ping action", () => {
    const result = PingRequest().safeParse({ action: "subscribe" });
    assert(!result.success);
  });
});
