import { NewUnconfirmedBlockRequest } from "../../../../../src/nano/web-socket/requests/new-unconfirmed-block";

describe("NewUnconfirmedBlockRequest schema", () => {
  test("validates new unconfirmed block request", () => {
    const result = NewUnconfirmedBlockRequest().safeParse({
      action: "subscribe",
      topic: "new_unconfirmed_block",
      ack: true,
    });
    expect(result.success).toBe(true);
  });

  test("rejects new unconfirmed block request with invalid topic", () => {
    const result = NewUnconfirmedBlockRequest().safeParse({
      action: "subscribe",
      topic: "confirmation",
    });
    expect(result.success).toBe(false);
  });
});
