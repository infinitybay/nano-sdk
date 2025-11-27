import { BootstrapLazyRequest } from "../../../../../src/nano/rpc/requests/bootstrap-lazy";

describe("BootstrapLazyRequest schema", () => {
  test("validates bootstrap lazy request with optional force", () => {
    const result = BootstrapLazyRequest().safeParse({
      action: "bootstrap_lazy",
      force: true,
    });
    expect(result.success).toBe(true);
  });
});
