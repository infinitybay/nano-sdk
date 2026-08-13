import { WorkString, WorkStrings } from "../../../../src/nano/types/work";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("WorkString schema", () => {
  test("validates parsing of valid work values", () => {
    const validWorks = [TestData.Valid.Work1(), TestData.Valid.Work2(), TestData.Valid.Work3(), TestData.Valid.Work4()];
    for (const validWork of validWorks) {
      expect(WorkString().parse(validWork)).toBe(validWork);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(WorkString().parse(TestData.Valid.Work1().toUpperCase())).toBe(TestData.Valid.Work1().toUpperCase());
    expect(WorkString().parse(TestData.Valid.Work1().toLowerCase())).toBe(TestData.Valid.Work1().toLowerCase());
  });

  test("ensures zero work constant has expected length", () => {
    expect(WorkStrings.zero()).toHaveLength(16);
  });

  test("rejects work values with invalid characters", () => {
    assert(!WorkString().safeParse(TestData.Invalid.Work.InvalidCharacters()).success);
  });

  test("rejects work values exceeding length limit", () => {
    assert(!WorkString().safeParse(TestData.Invalid.Work.TooLong()).success);
  });

  test("rejects work values below length requirement", () => {
    assert(!WorkString().safeParse(TestData.Invalid.Work.TooShort()).success);
  });
});
