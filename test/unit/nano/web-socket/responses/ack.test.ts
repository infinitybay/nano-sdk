import { AckResponse } from "../../../../../src/nano/web-socket/responses/ack";
import { TestData } from "../../../test-data";

describe("AckResponse schema", () => {
  test("validates ack response with action acknowledgement", () => {
    const result = AckResponse().safeParse({ ack: "update", time: TestData.Valid.Timestamp1(), id: "789" });
    expect(result.success).toBe(true);
  });

  test("accepts pong acknowledgement", () => {
    const result = AckResponse().safeParse({ ack: "pong", time: TestData.Valid.Timestamp2() });
    expect(result.success).toBe(true);
  });

  test("rejects ack response with invalid time", () => {
    const result = AckResponse().safeParse({ ack: "subscribe", time: "-1" });
    expect(result.success).toBe(false);
  });
});
