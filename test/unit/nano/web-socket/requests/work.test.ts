import { WorkRequest } from "../../../../../src/nano/web-socket/requests/work";
import { assert } from "../../../../assert";

describe("WorkRequest schema", () => {
  test("validates work request", () => {
    const result = WorkRequest().safeParse({ action: "subscribe", topic: "work", ack: false });
    assert(result.success);
  });

  test("rejects work request with invalid topic", () => {
    const result = WorkRequest().safeParse({ action: "subscribe", topic: "confirmation" });
    assert(!result.success);
  });
});
