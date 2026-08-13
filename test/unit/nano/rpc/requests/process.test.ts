import { ProcessRequest } from "../../../../../src/nano/rpc/requests/process";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ProcessRequest schema", () => {
  test("validates process request with json block", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: true,
      subtype: "receive",
      block: TestData.Valid.StateBlock1(),
      force: true,
      async: true,
    });
    assert(result.success);
  });

  test("validates process request without json block", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: false,
      subtype: "receive",
      block: "block-string",
      force: true,
      async: true,
    });
    assert(result.success);
  });

  test("rejects process request with json flag and invalid block type", () => {
    const result = ProcessRequest().safeParse({
      action: "process",
      json_block: false,
      subtype: "receive",
      block: TestData.Valid.StateBlock1(),
    });
    assert(!result.success);
  });
});
