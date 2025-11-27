import { ChainRequest } from "../../../../../src/nano/rpc/requests/chain";
import { TestData } from "../../../test-data";

describe("ChainRequest schema", () => {
  test("validates chain request with optional offset and reverse flag", () => {
    const result = ChainRequest().safeParse({
      action: "chain",
      block: TestData.Valid.Hash1(),
      count: 5,
      offset: 1,
      reverse: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects chain request with invalid block hash", () => {
    const result = ChainRequest().safeParse({
      action: "chain",
      block: TestData.Invalid.Hash.InvalidCharacters(),
      count: 5,
    });
    expect(result.success).toBe(false);
  });
});
