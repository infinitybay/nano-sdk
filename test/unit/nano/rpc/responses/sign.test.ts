import { SignResponse } from "../../../../../src/nano/rpc/responses/sign";
import { TestData } from "../../../test-data";

describe("SignResponse schema", () => {
  test("parses sign response with block content when block flag is true", () => {
    const schema = SignResponse({ block: true });
    const result = schema.safeParse({
      signature: TestData.Valid.Signature1(),
      block: TestData.Valid.StateBlock1(),
    });
    expect(result.success).toBe(true);
  });

  test("parses sign response without block when flag is false", () => {
    const schema = SignResponse({ block: false });
    const result = schema.safeParse({
      signature: TestData.Valid.Signature2(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects sign response with invalid signature", () => {
    const schema = SignResponse({ block: false });
    const result = schema.safeParse({
      signature: TestData.Invalid.Signature.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
