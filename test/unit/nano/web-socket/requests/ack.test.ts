import { AckRequest } from "../../../../../src/nano/web-socket/requests/ack";
import { assert } from "../../../../assert";

describe("AckRequest schema", () => {
  test("validates ack request with action and optional fields", () => {
    const result = AckRequest().safeParse({ action: "subscribe", ack: true, id: "123" });
    assert(result.success);
  });

  test("accepts ping action as an alternative", () => {
    const result = AckRequest().safeParse({ action: "ping" });
    assert(result.success);
  });

  test("rejects ack request with invalid action", () => {
    const result = AckRequest().safeParse({ action: "other", ack: true });
    assert(!result.success);
  });
});
