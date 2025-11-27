import { BootstrapResetRequest } from "../../../../../src/nano/rpc/requests/bootstrap-reset";

describe("BootstrapResetRequest schema", () => {
  test("validates bootstrap reset request", () => {
    const result = BootstrapResetRequest().safeParse({
      action: "bootstrap_reset",
    });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap reset request with invalid action", () => {
    const result = BootstrapResetRequest().safeParse({
      action: "bootstrap_reset_invalid",
    });
    expect(result.success).toBe(false);
  });
});
