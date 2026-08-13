import { AccountsFrontiersRequest } from "../../../../../src/nano/rpc/requests/accounts-frontiers";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AccountsFrontiersRequest schema", () => {
  test("validates accounts frontiers request", () => {
    const result = AccountsFrontiersRequest().safeParse({
      action: "accounts_frontiers",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
    });
    assert(result.success);
  });

  test("rejects accounts frontiers request with invalid account entry", () => {
    const result = AccountsFrontiersRequest().safeParse({
      action: "accounts_frontiers",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
