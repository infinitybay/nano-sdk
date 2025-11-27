import { SignRequest } from "../../../../../src/nano/rpc/requests/sign";
import { TestData } from "../../../test-data";

describe("SignRequest schema", () => {
  test("validates signing request with json block and hash", () => {
    const result = SignRequest().safeParse({
      action: "sign",
      json_block: true,
      key: TestData.Valid.PrivateKey1(),
      block: TestData.Valid.StateBlock1(),
      hash: TestData.Valid.Hash1(),
      wallet: TestData.Valid.PublicKey1(),
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("validates signing request with string block", () => {
    const result = SignRequest().safeParse({
      action: "sign",
      json_block: false,
      key: TestData.Valid.PrivateKey1(),
      block: "block-string",
      account: TestData.Valid.Account1(),
    });
    expect(result.success).toBe(true);
  });

  test("rejects signing request with json flag and invalid block type", () => {
    const result = SignRequest().safeParse({
      action: "sign",
      json_block: true,
      block: "block-string",
    });
    expect(result.success).toBe(false);
  });

  test("rejects signing request with invalid hash type", () => {
    const result = SignRequest().safeParse({
      action: "sign",
      json_block: false,
      block: "block-string",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
