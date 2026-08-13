import { ValidateAccountNumberResponse } from "../../../../../src/nano/rpc/responses/validate-account-number";
import { assert } from "../../../../assert";

describe("ValidateAccountNumberResponse schema", () => {
  test("parses valid account number response", () => {
    const result = ValidateAccountNumberResponse().safeParse({ valid: "1" });
    assert(result.success);
  });

  test("rejects account number response with invalid flag", () => {
    const result = ValidateAccountNumberResponse().safeParse({ valid: "2" });
    assert(!result.success);
  });
});
