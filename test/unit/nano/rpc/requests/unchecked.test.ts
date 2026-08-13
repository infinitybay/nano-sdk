import { UncheckedRequest } from "../../../../../src/nano/rpc/requests/unchecked";
import { assert } from "../../../../assert";

describe("UncheckedRequest schema", () => {
  test("validates unchecked request with optional options", () => {
    const result = UncheckedRequest().safeParse({
      action: "unchecked",
      count: 5,
      json_block: true,
    });
    assert(result.success);
  });

  test("rejects unchecked request with invalid action", () => {
    const result = UncheckedRequest().safeParse({
      action: "unchecked_invalid",
    });
    assert(!result.success);
  });
});
