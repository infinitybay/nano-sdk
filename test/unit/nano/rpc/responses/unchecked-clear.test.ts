import { UncheckedClearResponse } from "../../../../../src/nano/rpc/responses/unchecked-clear";
import { assert } from "../../../../assert";

describe("UncheckedClearResponse schema", () => {
  test("parses unchecked clear response", () => {
    const result = UncheckedClearResponse().safeParse({ success: "" });
    assert(result.success);
  });

  test("rejects unchecked clear response without success", () => {
    const result = UncheckedClearResponse().safeParse({});
    assert(!result.success);
  });
});
