import { AccountKeyResponse } from "../../../../../src/nano/rpc/responses/account-key";
import { TestData } from "../../../test-data";

describe("AccountKeyResponse schema", () => {
  test("parses account key response", () => {
    const result = AccountKeyResponse().safeParse({
      key: TestData.Valid.PublicKey1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects account key response with invalid key", () => {
    const result = AccountKeyResponse().safeParse({
      key: TestData.Invalid.PublicKey.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
