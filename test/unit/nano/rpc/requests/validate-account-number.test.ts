import { ValidateAccountNumberRequest } from "../../../../../src/nano/rpc/requests/validate-account-number";
import { TestData } from "../../../test-data";

describe("ValidateAccountNumberRequest schema", () => {
  test("validates account number validation request", () => {
    const result = ValidateAccountNumberRequest().safeParse({
      action: "validate_account_number",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account number validation request with invalid action", () => {
    const result = ValidateAccountNumberRequest().safeParse({
      action: "validate_account_number_invalid",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(false);
  });
});
