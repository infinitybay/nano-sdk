import { BootstrapPrioritiesRequest } from "../../../../../src/nano/rpc/requests/bootstrap-priorities";
import { assert } from "../../../../assert";

describe("BootstrapPrioritiesRequest schema", () => {
  test("validates bootstrap priorities request", () => {
    const result = BootstrapPrioritiesRequest().safeParse({
      action: "bootstrap_priorities",
    });
    assert(result.success);
  });

  test("rejects bootstrap priorities request with invalid action", () => {
    const result = BootstrapPrioritiesRequest().safeParse({
      action: "bootstrap_priorities_invalid",
    });
    assert(!result.success);
  });
});
