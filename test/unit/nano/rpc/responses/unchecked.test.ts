import { UncheckedResponse } from "../../../../../src/nano/rpc/responses/unchecked";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("UncheckedResponse schema", () => {
  test("parses unchecked response with empty blocks map", () => {
    const schema = UncheckedResponse({ json_block: true });
    const result = schema.safeParse({
      blocks: "",
    });
    assert(result.success);
  });

  test("parses unchecked response with block objects when json flag is true", () => {
    const schema = UncheckedResponse({ json_block: true });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: TestData.Valid.StateBlock1(),
      },
    });
    assert(result.success);
  });

  test("parses unchecked response with block strings when json flag is false", () => {
    const schema = UncheckedResponse({ json_block: false });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: "block-data",
      },
    });
    assert(result.success);
  });

  test("rejects unchecked response with invalid block contents when json flag is true", () => {
    const schema = UncheckedResponse({ json_block: true });
    const result = schema.safeParse({
      blocks: {
        [TestData.Valid.Hash1()]: "block-data",
      },
    });
    assert(!result.success);
  });

  test("rejects unchecked response with invalid block hash key", () => {
    const schema = UncheckedResponse({ json_block: false });
    const result = schema.safeParse({
      blocks: {
        [TestData.Invalid.Hash.InvalidCharacters()]: "block-data",
      },
    });
    assert(!result.success);
  });
});
