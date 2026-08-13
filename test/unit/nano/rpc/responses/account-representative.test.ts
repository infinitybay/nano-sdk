import { AccountRepresentativeResponse } from "../../../../../src/nano/rpc/responses/account-representative";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountRepresentativeResponse schema", () => {
  test("parses account representative response", () => {
    const result = AccountRepresentativeResponse().safeParse({
      representative: TestData.Valid.Representative1(),
    });
    assert(result.success);
  });

  test("rejects account representative response with invalid representative", () => {
    const result = AccountRepresentativeResponse().safeParse({
      representative: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
