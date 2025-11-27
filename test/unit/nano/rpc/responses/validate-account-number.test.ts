import { ValidateAccountNumberResponse } from "../../../../../src/nano/rpc/responses/validate-account-number";

describe("ValidateAccountNumberResponse schema", () => {
  test("parses valid account number response", () => {
    const result = ValidateAccountNumberResponse().safeParse({ valid: "1" });
    expect(result.success).toBe(true);
  });

  test("rejects account number response with invalid flag", () => {
    const result = ValidateAccountNumberResponse().safeParse({ valid: "2" });
    expect(result.success).toBe(false);
  });
});
