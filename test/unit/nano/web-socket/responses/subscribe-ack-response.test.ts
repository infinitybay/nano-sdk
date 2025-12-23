import { SubscribeAckResponse } from "../../../../../src/nano/web-socket/responses/subscribe-ack-response";
import { TestData } from "../../../test-data";

describe("SubscribeAckResponse schema", () => {
  test("validates subscribe ack response", () => {
    const result = SubscribeAckResponse().safeParse({
      ack: "subscribe",
      time: TestData.Valid.Timestamp1(),
      id: "42",
    });
    expect(result.success).toBe(true);
  });

  test("rejects subscribe ack response with invalid time", () => {
    const result = SubscribeAckResponse().safeParse({ ack: "subscribe", time: "-1" });
    expect(result.success).toBe(false);
  });
});
