import { UncheckedKeysRequest } from "../../../../../src/nano/rpc/requests/unchecked-keys";
import { TestData } from "../../../test-data";

describe("UncheckedKeysRequest schema", () => {
  test("validates unchecked keys request with optional json flag", () => {
    const result = UncheckedKeysRequest().safeParse({
      action: "unchecked_keys",
      json_block: true,
      count: 5,
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked keys request with invalid key hash", () => {
    const result = UncheckedKeysRequest().safeParse({
      action: "unchecked_keys",
      key: TestData.Invalid.Hash.InvalidCharacters(),
      count: 1,
    });
    expect(result.success).toBe(false);
  });
});
