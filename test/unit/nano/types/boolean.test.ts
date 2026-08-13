import { BooleanString } from "../../../../src/nano/types/boolean";
import { assert } from "../../../assert";

describe("BooleanString schema", () => {
  test("validates boolean strings", () => {
    expect(BooleanString().parse("true")).toBe("true");
    expect(BooleanString().parse("false")).toBe("false");
  });

  test("rejects non-boolean strings", () => {
    assert(!BooleanString().safeParse("0").success);
    assert(!BooleanString().safeParse("1").success);
    assert(!BooleanString().safeParse("True").success);
    assert(!BooleanString().safeParse("FALSE").success);
    assert(!BooleanString().safeParse("yes").success);
    assert(!BooleanString().safeParse("").success);
  });
});
