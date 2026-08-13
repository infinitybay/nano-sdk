import { AckResponse } from "../../../../../src/nano/web-socket/responses/ack";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("AckResponse schema", () => {
  test("validates ack response with action acknowledgement", () => {
    const result = AckResponse().safeParse({ ack: "update", time: TestData.Valid.Timestamp1(), id: "789" });
    assert(result.success);
  });

  test("accepts pong acknowledgement", () => {
    const result = AckResponse().safeParse({ ack: "pong", time: TestData.Valid.Timestamp2() });
    assert(result.success);
  });

  test("rejects ack response with invalid time", () => {
    const result = AckResponse().safeParse({ ack: "subscribe", time: "-1" });
    assert(!result.success);
  });
});
