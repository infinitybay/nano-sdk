import { BootstrapRequest } from "../../../../../src/nano/rpc/requests/bootstrap";
import { assert } from "../../../../assert";

describe("BootstrapRequest schema", () => {
  test("validates bootstrap request with address and port", () => {
    const result = BootstrapRequest().safeParse({
      action: "bootstrap",
      address: "127.0.0.1",
      port: 7075,
    });
    assert(result.success);
  });

  test("rejects bootstrap request with out of range port", () => {
    const result = BootstrapRequest().safeParse({
      action: "bootstrap",
      address: "127.0.0.1",
      port: 70000,
    });
    assert(!result.success);
  });
});
