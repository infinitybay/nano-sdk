import { Ack } from "../../../../../src/nano/web-socket/types/ack";
import { assert } from "../../../../assert";

describe("Ack schema", () => {
  test("validates action acknowledgements and pong", () => {
    expect(Ack().parse("subscribe")).toBe("subscribe");
    expect(Ack().parse("unsubscribe")).toBe("unsubscribe");
    expect(Ack().parse("update")).toBe("update");
    expect(Ack().parse("pong")).toBe("pong");
  });

  test("rejects unsupported acknowledgements", () => {
    assert(!Ack().safeParse("ping").success);
  });
});
