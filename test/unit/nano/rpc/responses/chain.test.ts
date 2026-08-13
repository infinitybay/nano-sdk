import { ChainResponse } from "../../../../../src/nano/rpc/responses/chain";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ChainResponse schema", () => {
  test("parses empty chain response blocks", () => {
    const result = ChainResponse().safeParse({
      blocks: "",
    });
    assert(result.success);
  });

  test("parses chain response hashes", () => {
    const result = ChainResponse().safeParse({
      blocks: [TestData.Valid.Hash1(), TestData.Valid.Hash2()],
    });
    assert(result.success);
  });

  test("rejects chain response with invalid hash entry", () => {
    const result = ChainResponse().safeParse({
      blocks: [TestData.Invalid.Hash.InvalidCharacters()],
    });
    assert(!result.success);
  });
});
