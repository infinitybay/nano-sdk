import { ReceivableExistsResponse } from "../../../../../src/nano/rpc/responses/receivable-exists";

describe("ReceivableExistsResponse schema", () => {
  test("parses receivable exists positive response", () => {
    const result = ReceivableExistsResponse().safeParse({ exists: "1" });
    expect(result.success).toBe(true);
  });

  test("rejects receivable exists response with invalid flag", () => {
    const result = ReceivableExistsResponse().safeParse({ exists: "2" });
    expect(result.success).toBe(false);
  });
});
