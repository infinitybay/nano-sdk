import { UncheckedGetResponse } from "../../../../../src/nano/rpc/responses/unchecked-get";
import { TestData } from "../../../test-data";

describe("UncheckedGetResponse schema", () => {
  test("parses unchecked get response with block contents when json flag is true", () => {
    const schema = UncheckedGetResponse({ json_block: true });
    const result = schema.safeParse({
      modified_timestamp: TestData.Valid.Timestamp1(),
      contents: TestData.Valid.StateBlock1(),
    });
    expect(result.success).toBe(true);
  });

  test("parses unchecked get response with string contents when json flag is false", () => {
    const schema = UncheckedGetResponse({ json_block: false });
    const result = schema.safeParse({
      modified_timestamp: TestData.Valid.Timestamp1(),
      contents: "block-data",
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked get response with invalid block contents when json flag is true", () => {
    const schema = UncheckedGetResponse({ json_block: true });
    const result = schema.safeParse({
      modified_timestamp: TestData.Valid.Timestamp1(),
      contents: "block-data",
    });
    expect(result.success).toBe(false);
  });
});
