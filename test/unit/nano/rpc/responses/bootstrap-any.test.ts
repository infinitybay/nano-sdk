import { BootstrapAnyResponse } from "../../../../../src/nano/rpc/responses/bootstrap-any";

describe("BootstrapAnyResponse schema", () => {
  test("parses bootstrap any response", () => {
    const result = BootstrapAnyResponse().safeParse({});
    expect(result.success).toBe(true);
  });
});
