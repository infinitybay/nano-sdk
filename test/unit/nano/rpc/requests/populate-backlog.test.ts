import { PopulateBacklogRequest } from "../../../../../src/nano/rpc/requests/populate-backlog";

describe("PopulateBacklogRequest schema", () => {
  test("validates populate backlog request", () => {
    const result = PopulateBacklogRequest().safeParse({
      action: "populate_backlog",
    });
    expect(result.success).toBe(true);
  });

  test("rejects populate backlog request with invalid action", () => {
    const result = PopulateBacklogRequest().safeParse({
      action: "populate_backlog_invalid",
    });
    expect(result.success).toBe(false);
  });
});
