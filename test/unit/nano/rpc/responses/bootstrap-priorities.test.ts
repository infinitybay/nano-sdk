import { BootstrapPrioritiesResponse } from "../../../../../src/nano/rpc/responses/bootstrap-priorities";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("BootstrapPrioritiesResponse schema", () => {
  test("parses empty bootstrap priorities and blocking lists", () => {
    const result = BootstrapPrioritiesResponse().safeParse({
      priorities: "",
      blocking: "",
    });
    assert(result.success);
  });

  test("parses bootstrap priorities and blocking lists", () => {
    const result = BootstrapPrioritiesResponse().safeParse({
      priorities: [
        { account: TestData.Valid.Account1(), priority: "10" },
        { account: TestData.Valid.Account2(), priority: "5" },
      ],
      blocking: [
        {
          account: TestData.Valid.Account3(),
          dependency: TestData.Valid.Hash1(),
          dependency_account: TestData.Valid.Account4(),
        },
      ],
    });
    assert(result.success);
  });

  test("rejects bootstrap priorities response with invalid dependency hash", () => {
    const result = BootstrapPrioritiesResponse().safeParse({
      priorities: "",
      blocking: [
        {
          account: TestData.Valid.Account1(),
          dependency: TestData.Invalid.Hash.InvalidCharacters(),
          dependency_account: TestData.Valid.Account2(),
        },
      ],
    });
    assert(!result.success);
  });
});
