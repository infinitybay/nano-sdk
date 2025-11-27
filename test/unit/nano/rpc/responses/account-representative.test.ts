import { AccountRepresentativeResponse } from "../../../../../src/nano/rpc/responses/account-representative";
import { TestData } from "../../../test-data";

describe("AccountRepresentativeResponse schema", () => {
  test("parses account representative response", () => {
    const result = AccountRepresentativeResponse().safeParse({
      representative: TestData.Valid.Representative1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account representative response with invalid representative", () => {
    const result = AccountRepresentativeResponse().safeParse({
      representative: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
