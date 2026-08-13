import { PopulateBacklogRequest } from "../../../../../src/nano/rpc/requests/populate-backlog";
import { assert } from "../../../../assert";

describe("PopulateBacklogRequest schema", () => {
  test("validates populate backlog request", () => {
    const result = PopulateBacklogRequest().safeParse({
      action: "populate_backlog",
    });
    assert(result.success);
  });

  test("rejects populate backlog request with invalid action", () => {
    const result = PopulateBacklogRequest().safeParse({
      action: "populate_backlog_invalid",
    });
    assert(!result.success);
  });
});
