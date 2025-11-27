import { BooleanOption } from "../../../../src/nano/types/boolean-option";

describe("BooleanOption type", () => {
  test("resolves conditional mappings for boolean options", () => {
    const trueCase: BooleanOption<true, "yes", "no"> = "yes";
    const falseCase: BooleanOption<false, "yes", "no"> = "no";
    const undefinedCase: BooleanOption<undefined, "yes", "no"> = "no";
    expect(trueCase).toBe("yes");
    expect(falseCase).toBe("no");
    expect(undefinedCase).toBe("no");
  });
});
