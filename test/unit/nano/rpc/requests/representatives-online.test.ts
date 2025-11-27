import { RepresentativesOnlineRequest } from "../../../../../src/nano/rpc/requests/representatives-online";
import { TestData } from "../../../test-data";

describe("RepresentativesOnlineRequest schema", () => {
  test("validates representatives online request with optional accounts and weight", () => {
    const result = RepresentativesOnlineRequest().safeParse({
      action: "representatives_online",
      accounts: [TestData.Valid.Account1(), TestData.Valid.Account2()],
      weight: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects representatives online request with invalid account", () => {
    const result = RepresentativesOnlineRequest().safeParse({
      action: "representatives_online",
      accounts: [TestData.Invalid.Account.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });
});
