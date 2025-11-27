import { BootstrapLazyResponse } from "../../../../../src/nano/rpc/responses/bootstrap-lazy";

describe("BootstrapLazyResponse schema", () => {
  test("parses bootstrap lazy response", () => {
    const result = BootstrapLazyResponse().safeParse({});
    expect(result.success).toBe(true);
  });
});
