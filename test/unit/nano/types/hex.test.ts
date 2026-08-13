import { HexString } from "../../../../src/nano/types/hex";
import { assert } from "../../../assert";

describe("HexString schema", () => {
  test("accepts uppercase and lowercase hex strings", () => {
    expect(HexString().parse("A")).toBe("A");
    expect(HexString().parse("a")).toBe("a");
    expect(HexString().parse("aBcDeF")).toBe("aBcDeF");
  });

  test("rejects hex strings with non-hex characters", () => {
    assert(!HexString().safeParse("Z").success);
    assert(!HexString().safeParse("z").success);
  });
});
