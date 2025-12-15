import { deriveAccountFromLink } from "../../../../src/nano/crypto/derive-account-from-link";
import { TestData } from "../../test-data";

describe("deriveAccountFromLink function", () => {
  test("derives expected account from valid link value", () => {
    const validLinks = [TestData.Valid.Link1(), TestData.Valid.Link2(), TestData.Valid.Link3(), TestData.Valid.Link4()];
    const expectedLinkAsAccounts = [
      TestData.Valid.LinkAsAccount1(),
      TestData.Valid.LinkAsAccount2(),
      TestData.Valid.LinkAsAccount3(),
      TestData.Valid.LinkAsAccount4(),
    ];
    for (let i = 0; i < validLinks.length; i++) {
      expect(deriveAccountFromLink({ link: validLinks[i], throwOnError: true })).toBe(expectedLinkAsAccounts[i]);
    }
  });

  test("rejects invalid link values", () => {
    const invalidLinks = [
      TestData.Invalid.Link.InvalidCharacters(),
      TestData.Invalid.Link.TooLong(),
      TestData.Invalid.Link.TooShort(),
    ];
    for (const invalidLink of invalidLinks) {
      expect(deriveAccountFromLink({ link: invalidLink, throwOnError: false }).success).toBe(false);
    }
  });
});
