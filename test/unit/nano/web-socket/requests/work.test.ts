import { WorkRequest } from "../../../../../src/nano/web-socket/requests/work";

describe("WorkRequest schema", () => {
  test("validates work request", () => {
    const result = WorkRequest().safeParse({ action: "subscribe", topic: "work", ack: false });
    expect(result.success).toBe(true);
  });

  test("rejects work request with invalid topic", () => {
    const result = WorkRequest().safeParse({ action: "subscribe", topic: "confirmation" });
    expect(result.success).toBe(false);
  });
});
