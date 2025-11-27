import { UncheckedGetRequest } from "../../../../../src/nano/rpc/requests/unchecked-get";
import { TestData } from "../../../test-data";

describe("UncheckedGetRequest schema", () => {
  test("validates unchecked get request with optional json flag", () => {
    const result = UncheckedGetRequest().safeParse({
      action: "unchecked_get",
      hash: TestData.Valid.Hash1(),
      json_block: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects unchecked get request with invalid hash", () => {
    const result = UncheckedGetRequest().safeParse({
      action: "unchecked_get",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
