import { WorkDifficultyString } from "../../../../src/nano/types";
import { TestData } from "../../test-data";

describe("WorkDifficultyString schema", () => {
  test("validates parsing of valid work difficulty strings", () => {
    const validWorkDifficulties = [
      TestData.Valid.Work1(),
      TestData.Valid.Work2(),
      TestData.Valid.Work3(),
      TestData.Valid.Work4(),
    ];
    for (const validWorkDifficulty of validWorkDifficulties) {
      expect(WorkDifficultyString().parse(validWorkDifficulty)).toBe(validWorkDifficulty);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(WorkDifficultyString().parse(TestData.Valid.WorkDifficulty1().toUpperCase())).toBe(
      TestData.Valid.WorkDifficulty1().toUpperCase()
    );
    expect(WorkDifficultyString().parse(TestData.Valid.WorkDifficulty1().toLowerCase())).toBe(
      TestData.Valid.WorkDifficulty1().toLowerCase()
    );
  });

  test("rejects work difficulty with invalid characters", () => {
    expect(WorkDifficultyString().safeParse(TestData.Invalid.WorkDifficulty.InvalidCharacters()).success).toBe(false);
  });

  test("rejects work difficulty exceeding length limit", () => {
    expect(WorkDifficultyString().safeParse(TestData.Invalid.WorkDifficulty.TooLong()).success).toBe(false);
  });

  test("rejects work difficulty below length requirement", () => {
    expect(WorkDifficultyString().safeParse(TestData.Invalid.WorkDifficulty.TooShort()).success).toBe(false);
  });
});
