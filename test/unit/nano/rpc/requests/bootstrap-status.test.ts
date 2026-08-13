import { BootstrapStatusRequest } from "../../../../../src/nano/rpc/requests/bootstrap-status";
import { assert } from "../../../../assert";

describe("BootstrapStatusRequest schema", () => {
  test("validates bootstrap status request", () => {
    const result = BootstrapStatusRequest().safeParse({
      action: "bootstrap_status",
    });
    assert(result.success);
  });

  test("rejects bootstrap status request with invalid action", () => {
    const result = BootstrapStatusRequest().safeParse({
      action: "bootstrap_status_invalid",
    });
    assert(!result.success);
  });
});
