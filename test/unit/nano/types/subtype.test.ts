import { SubtypeOpenString, SubtypeString, SubtypeUnknownString } from "../../../../src/nano/types/subtype";
import { assert } from "../../../assert";

describe("SubtypeString schema", () => {
  test("validates allowed subtype values", () => {
    const validSubtypes = ["change", "epoch", "receive", "send"];
    for (const validSubtype of validSubtypes) {
      expect(SubtypeString().parse(validSubtype)).toBe(validSubtype);
    }
  });

  test.each(["open", "unknown", "other"])("rejects the %s subtype", (subtype) => {
    assert(!SubtypeString().safeParse(subtype).success);
  });
});

describe("special subtype schemas", () => {
  test("validates the open subtype", () => {
    expect(SubtypeOpenString().parse("open")).toBe("open");
  });

  test("validates the unknown subtype", () => {
    expect(SubtypeUnknownString().parse("unknown")).toBe("unknown");
  });
});
