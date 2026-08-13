import { WorkDifficultyString } from "../../../../src/nano/types";
import { assert } from "../../../assert";
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
    assert(!WorkDifficultyString().safeParse(TestData.Invalid.WorkDifficulty.InvalidCharacters()).success);
  });

  test("rejects work difficulty exceeding length limit", () => {
    assert(!WorkDifficultyString().safeParse(TestData.Invalid.WorkDifficulty.TooLong()).success);
  });

  test("rejects work difficulty below length requirement", () => {
    assert(!WorkDifficultyString().safeParse(TestData.Invalid.WorkDifficulty.TooShort()).success);
  });
});
