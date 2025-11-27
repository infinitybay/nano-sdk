import { KeyExpandRequest } from "../../../../../src/nano/rpc/requests/key-expand";
import { TestData } from "../../../test-data";

describe("KeyExpandRequest schema", () => {
  test("validates key expand request", () => {
    const result = KeyExpandRequest().safeParse({
      action: "key_expand",
      key: TestData.Valid.PrivateKey1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects key expand request with invalid private key", () => {
    const result = KeyExpandRequest().safeParse({
      action: "key_expand",
      key: TestData.Invalid.PrivateKey.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
