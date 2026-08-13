import { BinaryBooleanString } from "../../../../src/nano/types/binary-boolean-string";
import { assert } from "../../../assert";

describe("BinaryBooleanString schema", () => {
  test("validates binary boolean strings", () => {
    expect(BinaryBooleanString().parse("0")).toBe("0");
    expect(BinaryBooleanString().parse("1")).toBe("1");
  });

  test("rejects non-binary boolean strings", () => {
    const invalidValues = ["true", "false", "2", "yes", "", "True", "01"];
    for (const value of invalidValues) {
      assert(!BinaryBooleanString().safeParse(value).success);
    }
  });
});
