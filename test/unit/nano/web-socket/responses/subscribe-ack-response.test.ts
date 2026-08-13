import { SubscribeAckResponse } from "../../../../../src/nano/web-socket/responses/subscribe-ack-response";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("SubscribeAckResponse schema", () => {
  test("validates subscribe ack response", () => {
    const result = SubscribeAckResponse().safeParse({
      ack: "subscribe",
      time: TestData.Valid.Timestamp1(),
      id: "42",
    });
    assert(result.success);
  });

  test("rejects subscribe ack response with invalid time", () => {
    const result = SubscribeAckResponse().safeParse({ ack: "subscribe", time: "-1" });
    assert(!result.success);
  });
});
