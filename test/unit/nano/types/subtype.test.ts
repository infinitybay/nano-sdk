import { SubtypeString } from "../../../../src/nano/types/subtype";
import { assert } from "../../../assert";

describe("SubtypeString schema", () => {
  test("validates allowed subtype values", () => {
    const validSubtypes = ["change", "epoch", "receive", "send", "unknown"];
    for (const validSubtype of validSubtypes) {
      expect(SubtypeString().parse(validSubtype)).toBe(validSubtype);
    }
  });

  test("rejects unknown subtype values", () => {
    assert(!SubtypeString().safeParse("other").success);
  });
});
