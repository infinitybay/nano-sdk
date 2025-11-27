import { FrontiersRequest } from "../../../../../src/nano/rpc/requests/frontiers";
import { TestData } from "../../../test-data";

describe("FrontiersRequest schema", () => {
  test("validates frontiers request", () => {
    const result = FrontiersRequest().safeParse({
      action: "frontiers",
      account: TestData.Valid.Account1(),
      count: 10,
    });
    expect(result.success).toBe(true);
  });

  test("rejects frontiers request with invalid account", () => {
    const result = FrontiersRequest().safeParse({
      action: "frontiers",
      account: TestData.Invalid.Account.InvalidCharacters(),
      count: 1,
    });
    expect(result.success).toBe(false);
  });
});
