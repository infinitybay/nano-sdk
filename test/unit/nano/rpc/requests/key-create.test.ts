import { KeyCreateRequest } from "../../../../../src/nano/rpc/requests/key-create";

describe("KeyCreateRequest schema", () => {
  test("validates key create request", () => {
    const result = KeyCreateRequest().safeParse({
      action: "key_create",
    });
    expect(result.success).toBe(true);
  });

  test("rejects key create request with invalid action", () => {
    const result = KeyCreateRequest().safeParse({
      action: "key_create_invalid",
    });
    expect(result.success).toBe(false);
  });
});
