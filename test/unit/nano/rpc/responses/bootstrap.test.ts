import { BootstrapResponse } from "../../../../../src/nano/rpc/responses/bootstrap";

describe("BootstrapResponse schema", () => {
  test("parses bootstrap response", () => {
    const result = BootstrapResponse().safeParse({});
    expect(result.success).toBe(true);
  });
});
