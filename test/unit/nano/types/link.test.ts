import { LinkString } from "../../../../src/nano/types/link";
import { assert } from "../../../assert";
import { TestData } from "../../test-data";

describe("LinkString schema", () => {
  test("validates parsing of valid links", () => {
    const validLinks = [TestData.Valid.Link1(), TestData.Valid.Link2(), TestData.Valid.Link3(), TestData.Valid.Link4()];
    for (const validLink of validLinks) {
      expect(LinkString().parse(validLink)).toBe(validLink);
    }
  });

  test("accepts uppercase and lowercase inputs", () => {
    expect(LinkString().parse(TestData.Valid.Link1().toUpperCase())).toBe(TestData.Valid.Link1().toUpperCase());
    expect(LinkString().parse(TestData.Valid.Link1().toLowerCase())).toBe(TestData.Valid.Link1().toLowerCase());
  });

  test("rejects links with invalid characters", () => {
    assert(!LinkString().safeParse(TestData.Invalid.Link.InvalidCharacters()).success);
  });

  test("rejects links exceeding length limit", () => {
    assert(!LinkString().safeParse(TestData.Invalid.Link.TooLong()).success);
  });

  test("rejects links below length requirement", () => {
    assert(!LinkString().safeParse(TestData.Invalid.Link.TooShort()).success);
  });
});
