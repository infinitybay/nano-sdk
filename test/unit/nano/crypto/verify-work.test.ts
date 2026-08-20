import { verifyWork } from "../../../../src/nano/crypto/verify-work";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("verifyWork function", () => {
  test("validates work values against thresholds", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), work: TestData.Valid.Work1(), threshold: TestData.Valid.WorkDifficulty1() },
      { hash: TestData.Valid.Hash2(), work: TestData.Valid.Work2(), threshold: TestData.Valid.WorkDifficulty2() },
      { hash: TestData.Valid.Hash3(), work: TestData.Valid.Work3(), threshold: TestData.Valid.WorkDifficulty3() },
      { hash: TestData.Valid.Hash4(), work: TestData.Valid.Work4(), threshold: TestData.Valid.WorkDifficulty4() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyWork({ ...data[i], throwOnError: false });
      expect(result).toEqual({ checked: true, validWork: true });
    }
  });

  test("does not retain the internal work-byte reversal between calls", () => {
    const params = {
      hash: TestData.Valid.Hash1(),
      work: TestData.Valid.Work1(),
      threshold: TestData.Valid.WorkDifficulty1(),
      throwOnError: false as const,
    };

    expect(verifyWork(params)).toEqual({ checked: true, validWork: true });
    expect(verifyWork(params)).toEqual({ checked: true, validWork: true });
  });

  test("rejects work values that fail hash checks", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), work: TestData.Valid.Work4(), threshold: TestData.Valid.WorkDifficulty1() },
      { hash: TestData.Valid.Hash2(), work: TestData.Valid.Work3(), threshold: TestData.Valid.WorkDifficulty2() },
      { hash: TestData.Valid.Hash3(), work: TestData.Valid.Work2(), threshold: TestData.Valid.WorkDifficulty3() },
      { hash: TestData.Valid.Hash4(), work: TestData.Valid.Work1(), threshold: TestData.Valid.WorkDifficulty4() },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyWork({ ...data[i], throwOnError: false });
      assert(result.checked);
      expect(result.validWork).toBe(false);
    }
  });

  test("rejects work values that fail threshold checks", () => {
    const data = [
      { hash: TestData.Valid.Hash1(), work: TestData.Valid.Work1(), threshold: "ffffffffff000000" },
      { hash: TestData.Valid.Hash2(), work: TestData.Valid.Work2(), threshold: "ffffffffff000000" },
      { hash: TestData.Valid.Hash3(), work: TestData.Valid.Work3(), threshold: "ffffffffff000000" },
      { hash: TestData.Valid.Hash4(), work: TestData.Valid.Work4(), threshold: "ffffffffff000000" },
    ];
    for (let i = 0; i < data.length; i++) {
      const result = verifyWork({ ...data[i], throwOnError: false });
      assert(result.checked);
      expect(result.validWork).toBe(false);
    }
  });
});
