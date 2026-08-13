import { NewUnconfirmedBlockRequest } from "../../../../../src/nano/web-socket/requests/new-unconfirmed-block";
import { assert } from "../../../../assert";

describe("NewUnconfirmedBlockRequest schema", () => {
  test("validates new unconfirmed block request", () => {
    const result = NewUnconfirmedBlockRequest().safeParse({
      action: "subscribe",
      topic: "new_unconfirmed_block",
      ack: true,
    });
    assert(result.success);
  });

  test("rejects new unconfirmed block request with invalid topic", () => {
    const result = NewUnconfirmedBlockRequest().safeParse({
      action: "subscribe",
      topic: "confirmation",
    });
    assert(!result.success);
  });
});
