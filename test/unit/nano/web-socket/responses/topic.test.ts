import { TopicResponse } from "../../../../../src/nano/web-socket/responses/topic";
import { TestData } from "../../../test-data";

describe("TopicResponse schema", () => {
  test("validates topic response structure", () => {
    const result = TopicResponse().safeParse({ topic: "work", time: TestData.Valid.Timestamp1() });
    expect(result.success).toBe(true);
  });

  test("rejects topic response with invalid topic", () => {
    const result = TopicResponse().safeParse({ topic: "other", time: TestData.Valid.Timestamp1() });
    expect(result.success).toBe(false);
  });
});
