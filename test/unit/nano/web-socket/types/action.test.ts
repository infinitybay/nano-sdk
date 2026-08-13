import { Action } from "../../../../../src/nano/web-socket/types/action";
import { assert } from "../../../../assert";

describe("Action schema", () => {
  test("validates allowed actions", () => {
    expect(Action().parse("subscribe")).toBe("subscribe");
    expect(Action().parse("unsubscribe")).toBe("unsubscribe");
    expect(Action().parse("update")).toBe("update");
  });

  test("rejects unsupported actions", () => {
    assert(!Action().safeParse("ping").success);
  });
});
