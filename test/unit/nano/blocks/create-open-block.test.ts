import { BlockErrorCode } from "../../../../src/nano/blocks/block-error-code";
import { createChangeBlock } from "../../../../src/nano/blocks/create-change-block";
import { createOpenBlock } from "../../../../src/nano/blocks/create-open-block";
import { createSendBlock } from "../../../../src/nano/blocks/create-send-block";
import { CryptoErrorCode } from "../../../../src/nano/crypto/crypto-error-code";
import { deriveAccountFromLink } from "../../../../src/nano/crypto/derive-account-from-link";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { HashStrings } from "../../../../src/nano/types/hash";
import { SignatureStrings } from "../../../../src/nano/types/signature";
import { WorkStrings } from "../../../../src/nano/types/work";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";
import { TestData } from "../../test-data";

describe("createOpenBlock function", () => {
  test("creates and signs an open block from a send state block", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      privateKey: TestData.Valid.PrivateKey1(),
    });

    const block = createOpenBlock({
      amount: "1000",
      representative: TestData.Valid.Account2(),
      sendBlock,
      privateKey: TestData.Valid.PrivateKey2(),
    });

    expect(block.account).toBe(TestData.Valid.Account2());
    expect(block.previous).toBe(HashStrings.zero());
    expect(block.representative).toBe(TestData.Valid.Account2());
    expect(block.balance).toBe("1000");
    expect(block.link).toBe(hashBlock({ block: sendBlock }));
    expect(block.link_as_account).toBe(deriveAccountFromLink({ link: block.link }));
    expect(block.signature).not.toBe(SignatureStrings.zero());
    expect(block.work).toBe(WorkStrings.zero());
    expect(verifyBlock({ block })).toBe(true);
  });

  test("uses an explicit representative and returns an unsigned block in non-throwing mode", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });

    const result = createOpenBlock({
      amount: 1000n,
      representative: TestData.Valid.Representative3(),
      sendBlock,
      throwOnError: false,
    });

    assert(result.success);
    expect(result.data.representative).toBe(TestData.Valid.Representative3());
    expect(result.data.signature).toBe(SignatureStrings.zero());
  });

  test("returns a block that can directly become the previous block of another creation call", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });
    const openBlock = createOpenBlock({
      amount: "1000",
      representative: TestData.Valid.Account2(),
      sendBlock,
    });

    const changeBlock = createChangeBlock({
      frontierBlock: openBlock,
      representative: TestData.Valid.Representative3(),
    });

    expect(changeBlock.previous).toBe(hashBlock({ block: openBlock }));
  });

  test("rejects invalid or inconsistent send blocks, zero amounts, and invalid representatives", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });
    const inconsistentSendBlock = {
      ...sendBlock,
      link_as_account: TestData.Valid.Account3(),
    };

    const inconsistentSendBlockResult = createOpenBlock({
      amount: "1000",
      representative: TestData.Valid.Representative3(),
      sendBlock: inconsistentSendBlock,
      throwOnError: false,
    });
    assert(!inconsistentSendBlockResult.success);
    expectErrorCode(inconsistentSendBlockResult.error, BlockErrorCode.SendLinkMismatch);

    const incompleteSendBlock = { ...sendBlock };
    delete (incompleteSendBlock as { signature?: string }).signature;
    expectToThrowErrorCode(
      () =>
        createOpenBlock({
          amount: "1000",
          representative: TestData.Valid.Representative3(),
          sendBlock: incompleteSendBlock,
        }),
      BlockErrorCode.InvalidSendBlock
    );

    const zeroAmountResult = createOpenBlock({
      amount: "0",
      representative: TestData.Valid.Representative3(),
      sendBlock,
      throwOnError: false,
    });
    assert(!zeroAmountResult.success);
    expectErrorCode(zeroAmountResult.error, BlockErrorCode.InvalidAmount);

    expectToThrowErrorCode(
      () =>
        createOpenBlock({
          amount: "-1",
          representative: TestData.Valid.Representative3(),
          sendBlock,
        }),
      BlockErrorCode.NegativeAmount
    );

    const negativeAmountResult = createOpenBlock({
      amount: -1n,
      representative: TestData.Valid.Representative3(),
      sendBlock,
      throwOnError: false,
    });
    assert(!negativeAmountResult.success);
    expectErrorCode(negativeAmountResult.error, BlockErrorCode.NegativeAmount);

    const invalidRepresentativeResult = createOpenBlock({
      amount: "1000",
      representative: TestData.Invalid.Account.ChecksumMismatch(),
      sendBlock,
      throwOnError: false,
    });
    assert(!invalidRepresentativeResult.success);
    expectErrorCode(invalidRepresentativeResult.error, BlockErrorCode.InvalidRepresentative);
  });

  test("rejects a private key that does not belong to the destination account", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });

    const result = createOpenBlock({
      amount: "1000",
      representative: TestData.Valid.Representative3(),
      sendBlock,
      privateKey: TestData.Valid.PrivateKey1(),
      throwOnError: false,
    });

    assert(!result.success);
    expectErrorCode(result.error, BlockErrorCode.SignBlockFailed);
    expectErrorCode(result.error.cause, CryptoErrorCode.KeyAccountMismatch);
  });
});
