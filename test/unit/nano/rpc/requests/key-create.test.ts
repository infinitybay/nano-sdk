import { KeyCreateRequest } from "../../../../../src/nano/rpc/requests/key-create";
import { assert } from "../../../../assert";

describe("KeyCreateRequest schema", () => {
  test("validates key create request", () => {
    const result = KeyCreateRequest().safeParse({
      action: "key_create",
    });
    assert(result.success);
  });

  test("rejects key create request with invalid action", () => {
    const result = KeyCreateRequest().safeParse({
      action: "key_create_invalid",
    });
    assert(!result.success);
  });
});
