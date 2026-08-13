import { UnsubscribeAckResponse } from "../../../../../src/nano/web-socket/responses/unsubscribe-ack-response";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("UnsubscribeAckResponse schema", () => {
  test("validates unsubscribe ack response", () => {
    const result = UnsubscribeAckResponse().safeParse({
      ack: "unsubscribe",
      time: TestData.Valid.Timestamp1(),
      id: "42",
    });
    assert(result.success);
  });

  test("rejects unsubscribe ack response with invalid time", () => {
    const result = UnsubscribeAckResponse().safeParse({ ack: "unsubscribe", time: "-1" });
    assert(!result.success);
  });
});
