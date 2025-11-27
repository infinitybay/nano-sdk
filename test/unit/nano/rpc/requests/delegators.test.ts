import { DelegatorsRequest } from "../../../../../src/nano/rpc/requests/delegators";
import { TestData } from "../../../test-data";

describe("DelegatorsRequest schema", () => {
  test("validates delegators request with threshold and pagination", () => {
    const result = DelegatorsRequest().safeParse({
      action: "delegators",
      account: TestData.Valid.Account1(),
      threshold: TestData.Valid.RawAmount1(),
      start: TestData.Valid.Account1(),
      count: 3,
    });
    expect(result.success).toBe(true);
  });

  test("rejects delegators request with invalid threshold", () => {
    const result = DelegatorsRequest().safeParse({
      action: "delegators",
      account: TestData.Valid.Account1(),
      threshold: TestData.Invalid.RawAmount.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
