import { StatsClearResponse } from "../../../../../src/nano/rpc/responses/stats-clear";
import { assert } from "../../../../assert";

describe("StatsClearResponse schema", () => {
  test("parses stats clear response", () => {
    const result = StatsClearResponse().safeParse({ success: "" });
    assert(result.success);
  });

  test("rejects stats clear response without success", () => {
    const result = StatsClearResponse().safeParse({});
    assert(!result.success);
  });
});
