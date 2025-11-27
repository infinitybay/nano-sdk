import { WorkGenerateResponse } from "../../../../../src/nano/rpc/responses/work-generate";
import { TestData } from "../../../test-data";

describe("WorkGenerateResponse schema", () => {
  test("parses work generate response", () => {
    const result = WorkGenerateResponse().safeParse({
      hash: TestData.Valid.Hash1(),
      work: TestData.Valid.Work1(),
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    expect(result.success).toBe(true);
  });

  test("rejects work generate response with invalid work", () => {
    const result = WorkGenerateResponse().safeParse({
      hash: TestData.Valid.Hash1(),
      work: TestData.Invalid.Work.InvalidCharacters(),
      difficulty: TestData.Valid.WorkDifficulty1(),
      multiplier: "1.0",
    });
    expect(result.success).toBe(false);
  });
});
