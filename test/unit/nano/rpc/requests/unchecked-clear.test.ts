import { UncheckedClearRequest } from "../../../../../src/nano/rpc/requests/unchecked-clear";
import { assert } from "../../../../assert";

describe("UncheckedClearRequest schema", () => {
  test("validates unchecked clear request", () => {
    const result = UncheckedClearRequest().safeParse({
      action: "unchecked_clear",
    });
    assert(result.success);
  });

  test("rejects unchecked clear request with invalid action", () => {
    const result = UncheckedClearRequest().safeParse({
      action: "unchecked_clear_invalid",
    });
    assert(!result.success);
  });
});
