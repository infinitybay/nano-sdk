import { PongAckResponse } from "../../../../../src/nano/web-socket/responses/pong-ack-response";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("PongAckResponse schema", () => {
  test("validates pong ack response", () => {
    const result = PongAckResponse().safeParse({ ack: "pong", time: TestData.Valid.Timestamp1(), id: "9" });
    assert(result.success);
  });

  test("rejects pong ack response with invalid time", () => {
    const result = PongAckResponse().safeParse({ ack: "pong", time: "-1" });
    assert(!result.success);
  });
});
