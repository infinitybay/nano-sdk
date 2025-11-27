import { ChainResponse } from "../../../../../src/nano/rpc/responses/chain";
import { TestData } from "../../../test-data";

describe("ChainResponse schema", () => {
  test("parses empty chain response blocks", () => {
    const result = ChainResponse().safeParse({
      blocks: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses chain response hashes", () => {
    const result = ChainResponse().safeParse({
      blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
    });
    expect(result.success).toBe(true);
  });

  test("rejects chain response with invalid hash entry", () => {
    const result = ChainResponse().safeParse({
      blocks: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });
});
