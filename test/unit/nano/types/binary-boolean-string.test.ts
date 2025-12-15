import { BinaryBooleanString } from "../../../../src/nano/types/binary-boolean-string";

describe("BinaryBooleanString schema", () => {
  test("validates binary boolean strings", () => {
    expect(BinaryBooleanString().parse("0")).toBe("0");
    expect(BinaryBooleanString().parse("1")).toBe("1");
  });

  test("rejects non-binary boolean strings", () => {
    const invalidValues = ["true", "false", "2", "yes", "", "True", "01"];
    for (const value of invalidValues) {
      expect(BinaryBooleanString().safeParse(value).success).toBe(false);
    }
  });
});
