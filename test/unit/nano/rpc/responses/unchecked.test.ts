import { UncheckedResponse } from "../../../../../src/nano/rpc/responses/unchecked";
import { TestData } from "../../../test-data";

describe("UncheckedResponse schema", () => {
  test("parses unchecked response with empty blocks map", () => {
    const schema = UncheckedResponse({ json_block: true });
    const result = schema.safeParse({
      blocks: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses unchecked response with block objects when json flag is true", () => {
    const schema = UncheckedResponse({ json_block: true });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: TestData.Valid.StateBlock1(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses unchecked response with block strings when json flag is false", () => {
    const schema = UncheckedResponse({ json_block: false });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: "block-data",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked response with invalid block contents when json flag is true", () => {
    const schema = UncheckedResponse({ json_block: true });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: "block-data",
      },
    });
    expect(result.success).toBe(false);
  });

  test("rejects unchecked response with invalid block hash key", () => {
    const schema = UncheckedResponse({ json_block: false });
    const result = schema.safeParse({
      blocks: {
        [TestData.Invalid.Hash.InvalidCharacters()]: "block-data",
      },
    });
    expect(result.success).toBe(false);
  });
});
