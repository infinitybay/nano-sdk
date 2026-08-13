import { ProcessResponse } from "../../../../../src/nano/rpc/responses/process";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("ProcessResponse schema", () => {
  test("parses process response when async is true", () => {
    const schema = ProcessResponse({ async: true });
    const result = schema.safeParse({ started: "1" });
    assert(result.success);
  });

  test("parses process response when async is false", () => {
    const schema = ProcessResponse({ async: false });
    const result = schema.safeParse({ hash: TestData.Valid.Hash1() });
    assert(result.success);
  });

  test("rejects process response missing hash when async is false", () => {
    const schema = ProcessResponse({ async: false });
    const result = schema.safeParse({});
    assert(!result.success);
  });
});
