import { KeepaliveRequest } from "../../../../../src/nano/rpc/requests/keepalive";
import { assert } from "../../../../assert";

describe("KeepaliveRequest schema", () => {
  test("validates keepalive request", () => {
    const result = KeepaliveRequest().safeParse({
      action: "keepalive",
      address: "127.0.0.1",
      port: "7075",
    });
    assert(result.success);
  });

  test("rejects keepalive request with missing address", () => {
    const result = KeepaliveRequest().safeParse({
      action: "keepalive",
      port: "7075",
    });
    assert(!result.success);
  });
});
