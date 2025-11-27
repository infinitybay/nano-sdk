import { UncheckedClearResponse } from "../../../../../src/nano/rpc/responses/unchecked-clear";

describe("UncheckedClearResponse schema", () => {
  test("parses unchecked clear response", () => {
    const result = UncheckedClearResponse().safeParse({ success: "" });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked clear response without success", () => {
    const result = UncheckedClearResponse().safeParse({});
    expect(result.success).toBe(false);
  });
});
