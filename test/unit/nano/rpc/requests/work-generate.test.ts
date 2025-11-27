import { WorkGenerateRequest } from "../../../../../src/nano/rpc/requests/work-generate";
import { TestData } from "../../../test-data";

describe("WorkGenerateRequest schema", () => {
  test("validates work generate request with json block", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      json_block: true,
      block: TestData.Valid.StateBlock1(),
      use_peers: true,
      account: TestData.Valid.Account1(),
      version: "work_1",
    });
    expect(result.success).toBe(true);
  });

  test("validates work generate request with string block", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      json_block: false,
      block: "block-string",
    });
    expect(result.success).toBe(true);
  });

  test("rejects work generate request with invalid hash", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });

  test("rejects work generate request with invalid account", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    expect(result.success).toBe(false);
  });
});
