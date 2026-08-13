import { bytesToWork, workToBytes } from "../../../../../src/nano/crypto/conversion/work-converter";
import { assert } from "../../../../assert";
import { TestData } from "../../../test-data";

describe("Work conversion utilities", () => {
  test("round-trips work values through byte conversion", () => {
    const validWorks = [
      TestData.Valid.Work1(),
      TestData.Valid.Work2().toLowerCase(),
      TestData.Valid.Work3(),
      TestData.Valid.Work4().toUpperCase(),
    ];

    for (const validWork of validWorks) {
      const workBytes = workToBytes({ work: validWork, throwOnError: true });
      const work = bytesToWork({ workBytes, throwOnError: true });
      expect(work.toUpperCase()).toBe(validWork.toUpperCase());
    }
  });

  test("rejects invalid work values", () => {
    const invalidWorks = [
      TestData.Invalid.Work.InvalidCharacters(),
      TestData.Invalid.Work.TooLong(),
      TestData.Invalid.Work.TooShort(),
    ];

    for (const invalidWork of invalidWorks) {
      assert(!workToBytes({ work: invalidWork, throwOnError: false }).success);
    }
  });

  test("rejects byte arrays with incorrect length", () => {
    assert(!bytesToWork({ workBytes: new Uint8Array([1, 2]), throwOnError: false }).success);
  });
});
