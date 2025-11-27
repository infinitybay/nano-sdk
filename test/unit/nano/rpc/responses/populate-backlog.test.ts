import { PopulateBacklogResponse } from "../../../../../src/nano/rpc/responses/populate-backlog";

describe("PopulateBacklogResponse schema", () => {
  test("parses populate backlog response", () => {
    const result = PopulateBacklogResponse().safeParse({ success: "" });
    expect(result.success).toBe(true);
  });

  test("rejects populate backlog response when success is missing", () => {
    const result = PopulateBacklogResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
