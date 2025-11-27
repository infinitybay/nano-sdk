import { DelegatorsCountRequest } from "../../../../../src/nano/rpc/requests/delegators-count";
import { TestData } from "../../../test-data";

describe("DelegatorsCountRequest schema", () => {
  test("validates delegators count request", () => {
    const result = DelegatorsCountRequest().safeParse({
      action: "delegators_count",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects delegators count request with invalid account", () => {
    const result = DelegatorsCountRequest().safeParse({
      action: "delegators_count",
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
