import { AccountKeyResponse } from "../../../../../src/nano/rpc/responses/account-key";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountKeyResponse schema", () => {
  test("parses account key response", () => {
    const result = AccountKeyResponse().safeParse({
      key: TestData.Valid.PublicKey1(),
    });
    assert(result.success);
  });

  test("rejects account key response with invalid key", () => {
    const result = AccountKeyResponse().safeParse({
      key: TestData.Invalid.PublicKey.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
