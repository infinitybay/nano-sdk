import { BlockErrorCode } from "../../../../src/nano/blocks/block-error-code";
import { createChangeBlock } from "../../../../src/nano/blocks/create-change-block";
import { CryptoErrorCode } from "../../../../src/nano/crypto/crypto-error-code";
import * as deriveAccountFromLinkModule from "../../../../src/nano/crypto/derive-account-from-link";
import { deriveAccountFromLink } from "../../../../src/nano/crypto/derive-account-from-link";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { HashStrings } from "../../../../src/nano/types/hash";
import { SignatureStrings } from "../../../../src/nano/types/signature";
import { WorkStrings } from "../../../../src/nano/types/work";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";
import { TestData } from "../../test-data";

describe("createChangeBlock function", () => {
  test("creates and signs a representative-change block from the frontier state block", () => {
    const frontierBlock = TestData.Valid.StateBlock1();

    const block = createChangeBlock({
      frontierBlock,
      representative: TestData.Valid.Representative2(),
      privateKey: TestData.Valid.PrivateKey1(),
    });

    expect(block.account).toBe(frontierBlock.account);
    expect(block.previous).toBe(hashBlock({ block: frontierBlock }));
    expect(block.balance).toBe(frontierBlock.balance);
    expect(block.representative).toBe(TestData.Valid.Representative2());
    expect(block.link).toBe(HashStrings.zero());
    expect(block.link_as_account).toBe(deriveAccountFromLink({ link: HashStrings.zero() }));
    expect(block.signature).not.toBe(SignatureStrings.zero());
    expect(block.work).toBe(WorkStrings.zero());
    expect(verifyBlock({ block })).toBe(true);
  });

  test("returns an unsigned block in non-throwing mode", () => {
    const frontierBlock = TestData.Valid.StateBlock1();
    const result = createChangeBlock({
      frontierBlock,
      representative: frontierBlock.representative,
      throwOnError: false,
    });

    assert(result.success);
    expect(result.data.signature).toBe(SignatureStrings.zero());
  });

  test("rejects invalid previous blocks, representatives, and signing keys", () => {
    const frontierBlock = TestData.Valid.StateBlock1();

    const incompleteFrontierBlock = { ...frontierBlock };
    delete (incompleteFrontierBlock as { work?: string }).work;
    const incompleteFrontierResult = createChangeBlock({
      frontierBlock: incompleteFrontierBlock,
      representative: TestData.Valid.Representative2(),
      throwOnError: false,
    });
    assert(!incompleteFrontierResult.success);
    expectErrorCode(incompleteFrontierResult.error, BlockErrorCode.InvalidFrontierBlock);

    const inconsistentFrontierBlock = {
      ...frontierBlock,
      link_as_account: TestData.Valid.Account2(),
    };
    expectToThrowErrorCode(
      () =>
        createChangeBlock({
          frontierBlock: inconsistentFrontierBlock,
          representative: TestData.Valid.Representative2(),
        }),
      BlockErrorCode.FrontierLinkMismatch
    );

    const invalidRepresentativeResult = createChangeBlock({
      frontierBlock,
      representative: TestData.Invalid.Account.ChecksumMismatch(),
      throwOnError: false,
    });
    assert(!invalidRepresentativeResult.success);
    expectErrorCode(invalidRepresentativeResult.error, BlockErrorCode.InvalidRepresentative);

    const mismatchedKeyResult = createChangeBlock({
      frontierBlock,
      representative: TestData.Valid.Representative2(),
      privateKey: TestData.Valid.PrivateKey2(),
      throwOnError: false,
    });
    assert(!mismatchedKeyResult.success);
    expectErrorCode(mismatchedKeyResult.error, BlockErrorCode.SignBlockFailed);
    expectErrorCode(mismatchedKeyResult.error.cause, CryptoErrorCode.KeyAccountMismatch);
  });

  test("converts unexpected internal exceptions according to the configured error mode", () => {
    const cause = new Error("Unexpected internal failure");
    const deriveAccountSpy = jest.spyOn(deriveAccountFromLinkModule, "deriveAccountFromLink").mockImplementation(() => {
      throw cause;
    });

    try {
      const params = {
        frontierBlock: TestData.Valid.StateBlock1(),
        representative: TestData.Valid.Representative2(),
      };
      const result = createChangeBlock({ ...params, throwOnError: false });

      assert(!result.success);
      expectErrorCode(result.error, BlockErrorCode.Unexpected);
      expect(result.error.cause).toBe(cause);

      expectToThrowErrorCode(() => createChangeBlock({ ...params, throwOnError: true }), BlockErrorCode.Unexpected);
    } finally {
      deriveAccountSpy.mockRestore();
    }
  });
});
