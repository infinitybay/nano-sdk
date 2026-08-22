import { WorkGenerateRequest } from "../../../../../src/nano/rpc/requests/work-generate";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("WorkGenerateRequest schema", () => {
  test("validates work generate request with json block", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      json_block: true,
      block: TestData.Valid.StateBlock1(),
      use_peers: true,
      secondary_work_peers: false,
      account: TestData.Valid.Account1(),
      version: "work_1",
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.5",
    });
    assert(result.success);
  });

  test("validates work generate request with string block", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      json_block: false,
      block: "block-string",
    });
    assert(result.success);
  });

  test("validates string boolean values for peer options", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      use_peers: "true",
      secondary_work_peers: "false",
    });
    assert(result.success);
  });

  test("rejects legacy blocks in JSON block mode", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      json_block: true,
      block: TestData.Valid.LegacySendBlock(),
    });
    assert(!result.success);
  });

  test("rejects work generate request with invalid hash", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Invalid.Hash.InvalidCharacters(),
    });
    assert(!result.success);
  });

  test("rejects work generate request with invalid account", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      account: TestData.Invalid.Account.InvalidCharacters(),
    });
    assert(!result.success);
  });

  test("rejects work generate request with invalid difficulty", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      difficulty: TestData.Invalid.WorkDifficulty.InvalidCharacters(),
    });
    assert(!result.success);
  });

  test("rejects work generate request with invalid multiplier", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      multiplier: "not-a-number",
    });
    assert(!result.success);
  });

  test("rejects work generate request with invalid secondary work peers value", () => {
    const result = WorkGenerateRequest().safeParse({
      action: "work_generate",
      hash: TestData.Valid.Hash1(),
      secondary_work_peers: "yes",
    });
    assert(!result.success);
  });
});
