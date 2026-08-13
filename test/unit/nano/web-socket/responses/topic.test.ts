import { TopicResponse } from "../../../../../src/nano/web-socket/responses/topic";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("TopicResponse schema", () => {
  test("validates topic response structure", () => {
    const result = TopicResponse().safeParse({ topic: "work", time: TestData.Valid.Timestamp1() });
    assert(result.success);
  });

  test("rejects topic response with invalid topic", () => {
    const result = TopicResponse().safeParse({ topic: "other", time: TestData.Valid.Timestamp1() });
    assert(!result.success);
  });
});
