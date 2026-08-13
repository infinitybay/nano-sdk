import { BootstrapRequest } from "../../../../../src/nano/web-socket/requests/bootstrap";
import { assert } from "../../../../assert";

describe("BootstrapRequest schema", () => {
  test("validates bootstrap request", () => {
    const result = BootstrapRequest().safeParse({ action: "subscribe", topic: "bootstrap", ack: true, id: "1" });
    assert(result.success);
  });

  test("rejects bootstrap request with invalid action", () => {
    const result = BootstrapRequest().safeParse({ action: "ping", topic: "bootstrap" });
    assert(!result.success);
  });
});
