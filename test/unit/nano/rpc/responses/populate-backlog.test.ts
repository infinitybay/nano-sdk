import { PopulateBacklogResponse } from "../../../../../src/nano/rpc/responses/populate-backlog";
import { assert } from "../../../../assert";

describe("PopulateBacklogResponse schema", () => {
  test("parses populate backlog response", () => {
    const result = PopulateBacklogResponse().safeParse({ success: "" });
    assert(result.success);
  });

  test("rejects populate backlog response when success is missing", () => {
    const result = PopulateBacklogResponse().safeParse({});
    assert(!result.success);
  });
});
