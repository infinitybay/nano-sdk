import { SuccessorsResponse } from "../../../../../src/nano/rpc/responses/successors";
import { TestData } from "../../../test-data";

describe("SuccessorsResponse schema", () => {
  test("parses successors response with empty blocks map", () => {
    const result = SuccessorsResponse().safeParse({
      blocks: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses successors response with block hashes", () => {
    const result = SuccessorsResponse().safeParse({
      blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
    });
    expect(result.success).toBe(true);
  });

  test("rejects successors response with invalid hash entry", () => {
    const result = SuccessorsResponse().safeParse({
      blocks: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    expect(result.success).toBe(false);
  });
});
