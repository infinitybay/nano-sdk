import { BootstrapAnyRequest } from "../../../../../src/nano/rpc/requests/bootstrap-any";

describe("BootstrapAnyRequest schema", () => {
  test("validates bootstrap any request with optional force", () => {
    const result = BootstrapAnyRequest().safeParse({
      action: "bootstrap_any",
      force: true,
    });
    expect(result.success).toBe(true);
  });
});
