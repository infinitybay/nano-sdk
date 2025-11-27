import { DelegatorsCountResponse } from "../../../../../src/nano/rpc/responses/delegators-count";

describe("DelegatorsCountResponse schema", () => {
  test("parses delegators count response", () => {
    const result = DelegatorsCountResponse().safeParse({
      count: "10",
    });
    expect(result.success).toBe(true);
  });

  /*test("rejects delegators count response with non-numeric count", () => {
    const result = DelegatorsCountResponse().safeParse({
      count: "abc",
    });
    expect(result.success).toBe(false);
  });*/
});
