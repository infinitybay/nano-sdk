import { BooleanString } from "../../../../src/nano/types/boolean";

describe("BooleanString schema", () => {
  test("validates boolean strings", () => {
    expect(BooleanString().parse("true")).toBe("true");
    expect(BooleanString().parse("false")).toBe("false");
  });

  test("rejects non-boolean strings", () => {
    expect(BooleanString().safeParse("0").success).toBe(false);
    expect(BooleanString().safeParse("1").success).toBe(false);
    expect(BooleanString().safeParse("True").success).toBe(false);
    expect(BooleanString().safeParse("FALSE").success).toBe(false);
    expect(BooleanString().safeParse("yes").success).toBe(false);
    expect(BooleanString().safeParse("").success).toBe(false);
  });
});
