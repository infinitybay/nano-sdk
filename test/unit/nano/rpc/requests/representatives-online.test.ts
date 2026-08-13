import { RepresentativesOnlineRequest } from "../../../../../src/nano/rpc/requests/representatives-online";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("RepresentativesOnlineRequest schema", () => {
  test("validates representatives online request with optional accounts and weight", () => {
    const result = RepresentativesOnlineRequest().safeParse({
      action: "representatives_online",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
      weight: true,
    });
    assert(result.success);
  });

  test("rejects representatives online request with invalid account", () => {
    const result = RepresentativesOnlineRequest().safeParse({
      action: "representatives_online",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
