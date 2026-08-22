import { ProcessRequest } from "../../../../../src/nano/rpc/requests/process";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ProcessRequest schema", () => {
  test("validates process request with JSON block and optional subtype", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: true,
      block: TestData.Valid.StateBlock1(),
      force: true,
      async: true,
    });
    assert(result.success);
  });

  test("validates process request without JSON block and optional subtype", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: false,
      block: "block-string",
      force: true,
      async: true,
    });
    assert(result.success);
  });

  test.each(["change", "epoch", "open", "receive", "send"])("validates the %s subtype", (subtype) => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: true,
      subtype,
      block: TestData.Valid.StateBlock1(),
    });
    assert(result.success);
  });

  test("rejects the unknown subtype", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: true,
      subtype: "unknown",
      block: TestData.Valid.StateBlock1(),
    });
    assert(!result.success);
  });

  test.each([
    TestData.Valid.LegacyChangeBlock(),
    TestData.Valid.LegacyOpenBlock(),
    TestData.Valid.LegacyReceiveBlock(),
    TestData.Valid.LegacySendBlock(),
  ])("rejects legacy JSON blocks", (block) => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: true,
      block,
    });
    assert(!result.success);
  });

  test("rejects process request with JSON flag and invalid block type", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: false,
      subtype: "receive",
      block: TestData.Valid.StateBlock1(),
    });
    assert(!result.success);
  });
});
