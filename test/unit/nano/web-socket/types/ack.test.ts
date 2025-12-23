import { Ack } from "../../../../../src/nano/web-socket/types/ack";

describe("Ack schema", () => {
  test("validates action acknowledgements and pong", () => {
    expect(Ack().parse("subscribe")).toBe("subscribe");
    expect(Ack().parse("unsubscribe")).toBe("unsubscribe");
    expect(Ack().parse("update")).toBe("update");
    expect(Ack().parse("pong")).toBe("pong");
  });

  test("rejects unsupported acknowledgements", () => {
    expect(Ack().safeParse("ping").success).toBe(false);
  });
});
