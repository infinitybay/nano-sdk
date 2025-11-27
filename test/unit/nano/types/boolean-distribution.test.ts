import { BooleanDistribution } from "../../../../src/nano/types/boolean-distribution";

describe("BooleanDistribution type", () => {
  test("validates distribution for boolean variants", () => {
    const trueCase: BooleanDistribution<true, "yes", "no"> = "yes";
    const falseCase: BooleanDistribution<false, "yes", "no"> = "no";
    const mixedCase1: BooleanDistribution<boolean, "yes", "no"> = "yes";
    const mixedCase2: BooleanDistribution<boolean, "yes", "no"> = "no";
    expect(trueCase).toBe("yes");
    expect(falseCase).toBe("no");
    expect(mixedCase1).toBe("yes");
    expect(mixedCase2).toBe("no");
  });
});
