import { UncheckedKeysResponse } from "../../../../../src/nano/rpc/responses/unchecked-keys";
import { TestData } from "../../../test-data";

describe("UncheckedKeysResponse schema", () => {
  test("parses unchecked keys response with empty unchecked map", () => {
    const schema = UncheckedKeysResponse({ json_block: true });
    const result = schema.safeParse({
      unchecked: "",
    });
    expect(result.success).toBe(true);
  });

  test("parses unchecked keys response with block contents when json flag is true", () => {
    const schema = UncheckedKeysResponse({ json_block: true });
    const result = schema.safeParse({
      unchecked: {
        key: TestData.Valid.Hash1(),
        hash: TestData.Valid.Hash2(),
        modified_timestamp: TestData.Valid.Timestamp1(),
        contents: TestData.Valid.StateBlock1(),
      },
    });
    expect(result.success).toBe(true);
  });

  test("parses unchecked keys response with string contents when json flag is false", () => {
    const schema = UncheckedKeysResponse({ json_block: false });
    const result = schema.safeParse({
      unchecked: {
        key: TestData.Valid.Hash1(),
        hash: TestData.Valid.Hash2(),
        modified_timestamp: TestData.Valid.Timestamp2(),
        contents: "block-data",
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked keys response with invalid block contents when json flag is true", () => {
    const schema = UncheckedKeysResponse({ json_block: true });
    const result = schema.safeParse({
      key: TestData.Valid.Hash1(),
      hash: TestData.Valid.Hash2(),
      modified_timestamp: TestData.Valid.Timestamp2(),
      contents: "block-data",
    });
    expect(result.success).toBe(false);
  });

  test("rejects unchecked keys response with invalid hash", () => {
    const schema = UncheckedKeysResponse({ json_block: true });
    const result = schema.safeParse({
      unchecked: {
        key: TestData.Invalid.Hash.InvalidCharacters(),
        hash: TestData.Valid.Hash2(),
        modified_timestamp: TestData.Valid.Timestamp1(),
        contents: TestData.Valid.StateBlock1(),
      },
    });
    expect(result.success).toBe(false);
  });
});
