import { SuccessorsRequest } from "../../../../../src/nano/rpc/requests/successors";
import { TestData } from "../../../test-data";

describe("SuccessorsRequest schema", () => {
  test("validates successors request with optional offset and reverse", () => {
    const result = SuccessorsRequest().safeParse({
      action: "successors",
      block: TestData.Valid.Hash1(),
      count: 5,
      offset: 1,
      reverse: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects successors request with invalid block hash", () => {
    const result = SuccessorsRequest().safeParse({
      action: "successors",
      block: TestData.Invalid.Hash.InvalidCharacters(),
      count: 1,
    });
    expect(result.success).toBe(false);
  });
});
