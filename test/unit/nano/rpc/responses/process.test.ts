import { ProcessResponse } from "../../../../../src/nano/rpc/responses/process";
import { TestData } from "../../../test-data";

describe("ProcessResponse schema", () => {
  test("parses process response when async is true", () => {
    const schema = ProcessResponse({ async: true });
    const result = schema.safeParse({ started: "1" });
    expect(result.success).toBe(true);
  });

  test("parses process response when async is false", () => {
    const schema = ProcessResponse({ async: false });
    const result = schema.safeParse({ hash: TestData.Valid.Hash1() });
    expect(result.success).toBe(true);
  });

  test("rejects process response missing hash when async is false", () => {
    const schema = ProcessResponse({ async: false });
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });
});
