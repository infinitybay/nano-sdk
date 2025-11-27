import { UncheckedRequest } from "../../../../../src/nano/rpc/requests/unchecked";

describe("UncheckedRequest schema", () => {
  test("validates unchecked request with optional options", () => {
    const result = UncheckedRequest().safeParse({
      action: "unchecked",
      count: 5,
      json_block: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked request with invalid action", () => {
    const result = UncheckedRequest().safeParse({
      action: "unchecked_invalid",
    });
    expect(result.success).toBe(false);
  });
});
