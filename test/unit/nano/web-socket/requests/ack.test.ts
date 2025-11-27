import { AckRequest } from "../../../../../src/nano/web-socket/requests/ack";

describe("AckRequest schema", () => {
  test("validates ack request with action and optional fields", () => {
    const result = AckRequest().safeParse({ action: "subscribe", ack: true, id: "123" });
    expect(result.success).toBe(true);
  });

  test("accepts ping action as an alternative", () => {
    const result = AckRequest().safeParse({ action: "ping" });
    expect(result.success).toBe(true);
  });

  test("rejects ack request with invalid action", () => {
    const result = AckRequest().safeParse({ action: "other", ack: true });
    expect(result.success).toBe(false);
  });
});
