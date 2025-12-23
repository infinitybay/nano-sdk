import { UnsubscribeAckResponse } from "../../../../../src/nano/web-socket/responses/unsubscribe-ack-response";
import { TestData } from "../../../test-data";

describe("UnsubscribeAckResponse schema", () => {
  test("validates unsubscribe ack response", () => {
    const result = UnsubscribeAckResponse().safeParse({
      ack: "unsubscribe",
      time: TestData.Valid.Timestamp1(),
      id: "42",
    });
    expect(result.success).toBe(true);
  });

  test("rejects unsubscribe ack response with invalid time", () => {
    const result = UnsubscribeAckResponse().safeParse({ ack: "unsubscribe", time: "-1" });
    expect(result.success).toBe(false);
  });
});
