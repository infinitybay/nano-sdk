import {
  LegacyChangeTypeString,
  LegacyOpenTypeString,
  LegacyReceiveTypeString,
  LegacySendTypeString,
  StateTypeString,
  TypeString,
} from "../../../../src/nano/types/type";
import { assert } from "../../../assert";

describe("TypeString schema", () => {
  test("validates allowed block type values including legacy forms", () => {
    const validTypes = ["change", "open", "receive", "send", "state"];
    for (const validType of validTypes) {
      expect(TypeString().parse(validType)).toBe(validType);
    }
    expect(LegacyChangeTypeString().parse("change")).toBe("change");
    expect(LegacyOpenTypeString().parse("open")).toBe("open");
    expect(LegacyReceiveTypeString().parse("receive")).toBe("receive");
    expect(LegacySendTypeString().parse("send")).toBe("send");
    expect(StateTypeString().parse("state")).toBe("state");
  });

  test("rejects unknown block types", () => {
    assert(!TypeString().safeParse("other").success);
  });
});
