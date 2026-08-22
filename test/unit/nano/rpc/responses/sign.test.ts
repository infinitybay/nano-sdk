import { SignResponse } from "../../../../../src/nano/rpc/responses/sign";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("SignResponse schema", () => {
  test("parses sign response with block content when block flag is true", () => {
    const schema = SignResponse({ block: true, json_block: true });
    const result = schema.safeParse({
      signature: TestData.Valid.Signature1(),
      block: TestData.Valid.StateBlock1(),
    });
    assert(result.success);
  });

  test("parses sign response with block string when JSON block flag is false", () => {
    const schema = SignResponse({ block: true, json_block: false });
    const result = schema.safeParse({
      signature: TestData.Valid.Signature1(),
      block: JSON.stringify(TestData.Valid.StateBlock1()),
    });
    assert(result.success);
  });

  test("parses sign response without block when flag is false", () => {
    const schema = SignResponse({ block: false, json_block: false });
    const result = schema.safeParse({
      signature: TestData.Valid.Signature2(),
    });
    assert(result.success);
  });

  test("rejects sign response with block representation that does not match JSON block flag", () => {
    const jsonResult = SignResponse({ block: true, json_block: true }).safeParse({
      signature: TestData.Valid.Signature1(),
      block: JSON.stringify(TestData.Valid.StateBlock1()),
    });
    const stringResult = SignResponse({ block: true, json_block: false }).safeParse({
      signature: TestData.Valid.Signature1(),
      block: TestData.Valid.StateBlock1(),
    });
    assert(!jsonResult.success);
    assert(!stringResult.success);
  });

  test("rejects sign response with invalid signature", () => {
    const schema = SignResponse({ block: false, json_block: false });
    const result = schema.safeParse({
      signature: TestData.Invalid.Signature.InvalidCharacters(),
    });
    assert(!result.success);
  });
});
