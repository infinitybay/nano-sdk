import { BootstrapStatusRequest } from "../../../../../src/nano/rpc/requests/bootstrap-status";

describe("BootstrapStatusRequest schema", () => {
  test("validates bootstrap status request", () => {
    const result = BootstrapStatusRequest().safeParse({
      action: "bootstrap_status",
    });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap status request with invalid action", () => {
    const result = BootstrapStatusRequest().safeParse({
      action: "bootstrap_status_invalid",
    });
    expect(result.success).toBe(false);
  });
});
