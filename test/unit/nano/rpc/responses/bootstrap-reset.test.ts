import { BootstrapResetResponse } from "../../../../../src/nano/rpc/responses/bootstrap-reset";

describe("BootstrapResetResponse schema", () => {
  test("parses bootstrap reset response", () => {
    const result = BootstrapResetResponse().safeParse({
      success: "",
    });
    expect(result.success).toBe(true);
  });

  test("rejects bootstrap reset response with missing success", () => {
    const result = BootstrapResetResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
