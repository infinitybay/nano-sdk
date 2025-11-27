import { BootstrapPrioritiesRequest } from "../../../../../src/nano/rpc/requests/bootstrap-priorities";

describe("BootstrapPrioritiesRequest schema", () => {
  test("validates bootstrap priorities request", () => {
    const result = BootstrapPrioritiesRequest().safeParse({
      action: "bootstrap_priorities",
    });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap priorities request with invalid action", () => {
    const result = BootstrapPrioritiesRequest().safeParse({
      action: "bootstrap_priorities_invalid",
    });
    expect(result.success).toBe(false);
  });
});
