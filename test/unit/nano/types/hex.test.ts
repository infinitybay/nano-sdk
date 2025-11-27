import { HexString } from "../../../../src/nano/types/hex";

describe("HexString schema", () => {
  test("accepts uppercase and lowercase hex strings", () => {
    expect(HexString().parse("A")).toBe("A");
    expect(HexString().parse("a")).toBe("a");
    expect(HexString().parse("aBcDeF")).toBe("aBcDeF");
  });

  test("rejects hex strings with non-hex characters", () => {
    expect(HexString().safeParse("Z").success).toBe(false);
    expect(HexString().safeParse("z").success).toBe(false);
  });
});
