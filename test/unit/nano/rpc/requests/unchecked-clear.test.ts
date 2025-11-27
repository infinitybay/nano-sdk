import { UncheckedClearRequest } from "../../../../../src/nano/rpc/requests/unchecked-clear";

describe("UncheckedClearRequest schema", () => {
  test("validates unchecked clear request", () => {
    const result = UncheckedClearRequest().safeParse({
      action: "unchecked_clear",
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked clear request with invalid action", () => {
    const result = UncheckedClearRequest().safeParse({
      action: "unchecked_clear_invalid",
    });
    expect(result.success).toBe(false);
  });
});
