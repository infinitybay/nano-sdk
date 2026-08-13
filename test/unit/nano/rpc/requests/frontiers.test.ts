import { FrontiersRequest } from "../../../../../src/nano/rpc/requests/frontiers";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("FrontiersRequest schema", () => {
  test("validates frontiers request", () => {
    const result = FrontiersRequest().safeParse({
      action: "frontiers",
      account: TestData.Valid.Account1(),
      count: 10,
    });
    assert(result.success);
  });

  test("rejects frontiers request with invalid account", () => {
    const result = FrontiersRequest().safeParse({
      action: "frontiers",
      account: TestData.Invalid.Account.InvalidCharacters(),
      count: 1,
    });
    assert(!result.success);
  });
});
