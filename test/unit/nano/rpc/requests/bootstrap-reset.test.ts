import { BootstrapResetRequest } from "../../../../../src/nano/rpc/requests/bootstrap-reset";
import { assert } from "../../../../assert";

describe("BootstrapResetRequest schema", () => {
  test("validates bootstrap reset request", () => {
    const result = BootstrapResetRequest().safeParse({
      action: "bootstrap_reset",
    });
    assert(result.success);
  });

  test("rejects bootstrap reset request with invalid action", () => {
    const result = BootstrapResetRequest().safeParse({
      action: "bootstrap_reset_invalid",
    });
    assert(!result.success);
  });
});
