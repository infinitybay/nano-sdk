import { CryptoError } from "../../../../src/nano/crypto/crypto-error";
import { CryptoErrorCode } from "../../../../src/nano/crypto/crypto-error-code";
import {
  deriveAccountFromLink,
  DeriveAccountFromLinkResult,
} from "../../../../src/nano/crypto/derive-account-from-link";
import * as deriveAccountFromPublicKeyModule from "../../../../src/nano/crypto/derive-account-from-public-key";
import { AccountString } from "../../../../src/nano/types/account";
import { Result } from "../../../../src/nano/types/result";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";
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

  test("preserves throwing-mode overload inference", () => {
    const link = TestData.Valid.Link1();
    const defaultResult: AccountString = deriveAccountFromLink({ link });
    const throwingResult: AccountString = deriveAccountFromLink({ link, throwOnError: true });
    const nonThrowingResult: DeriveAccountFromLinkResult = deriveAccountFromLink({ link, throwOnError: false });

    expect(defaultResult).toBe(TestData.Valid.LinkAsAccount1());
    expect(throwingResult).toBe(TestData.Valid.LinkAsAccount1());
    assert(nonThrowingResult.success);
  });

  test("rejects invalid link values", () => {
    const invalidLinks = [
      TestData.Invalid.Link.InvalidCharacters(),
      TestData.Invalid.Link.TooLong(),
      TestData.Invalid.Link.TooShort(),
    ];
    for (const invalidLink of invalidLinks) {
      assert(!deriveAccountFromLink({ link: invalidLink, throwOnError: false }).success);
    }
  });

  test("converts unexpected internal exceptions according to the configured error mode", () => {
    const cause = new CryptoError(CryptoErrorCode.InvalidPublicKey, "Unexpected internal failure");
    const deriveAccountSpy = jest
      .spyOn(deriveAccountFromPublicKeyModule, "deriveAccountFromPublicKey")
      .mockImplementation(() => {
        throw cause;
      });

    try {
      const link = TestData.Valid.Link1();
      const result = deriveAccountFromLink({ link, throwOnError: false });

      assert(!result.success);
      expectErrorCode(result.error, CryptoErrorCode.Unexpected);
      expect(result.error.cause).toBe(cause);

      expectToThrowErrorCode(() => deriveAccountFromLink({ link, throwOnError: true }), CryptoErrorCode.Unexpected);
    } finally {
      deriveAccountSpy.mockRestore();
    }
  });

  test("wraps dependency result errors with an operation-level error and cause", () => {
    const cause = new CryptoError(CryptoErrorCode.InvalidPublicKey, "Dependency failure");
    const deriveAccountSpy = jest
      .spyOn(deriveAccountFromPublicKeyModule, "deriveAccountFromPublicKey")
      .mockImplementation(() => Result.err(cause));

    try {
      const result = deriveAccountFromLink({ link: TestData.Valid.Link1(), throwOnError: false });

      assert(!result.success);
      expectErrorCode(result.error, CryptoErrorCode.DeriveAccountFromPublicKeyFailed);
      expect(result.error.cause).toBe(cause);
    } finally {
      deriveAccountSpy.mockRestore();
    }
  });
});
