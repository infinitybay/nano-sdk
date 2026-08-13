import { BlockErrorCode } from "../../../../src/nano/blocks/block-error-code";
import { createReceiveBlock } from "../../../../src/nano/blocks/create-receive-block";
import { createSendBlock } from "../../../../src/nano/blocks/create-send-block";
import { CryptoErrorCode } from "../../../../src/nano/crypto/crypto-error-code";
import { deriveAccountFromLink } from "../../../../src/nano/crypto/derive-account-from-link";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { RawAmounts } from "../../../../src/nano/types/amount";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";
import { TestData } from "../../test-data";

describe("createReceiveBlock function", () => {
  test("creates and signs a receive block from a send state block", () => {
    const frontierBlock = TestData.Valid.StateBlock1();
    const amount = "1000";
    const sendBlock = createSendBlock({
      amount,
      destination: frontierBlock.account,
      frontierBlock: TestData.Valid.StateBlock2(),
      privateKey: TestData.Valid.PrivateKey2(),
    });

    const block = createReceiveBlock({
      amount,
      frontierBlock,
      sendBlock,
      privateKey: TestData.Valid.PrivateKey1(),
    });

    const sendBlockHash = hashBlock({ block: sendBlock });
    expect(block.previous).toBe(hashBlock({ block: frontierBlock }));
    expect(block.balance).toBe((BigInt(frontierBlock.balance) + BigInt(amount)).toString());
    expect(block.link).toBe(sendBlockHash);
    expect(block.link_as_account).toBe(deriveAccountFromLink({ link: sendBlockHash }));
    expect(block.representative).toBe(frontierBlock.representative);
    expect(verifyBlock({ block })).toBe(true);
  });

  test("validates the send destination and accepts an explicit representative", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });
    const frontierBlock = TestData.Valid.StateBlock2();

    const block = createReceiveBlock({
      amount: "1000",
      frontierBlock,
      representative: TestData.Valid.Representative3(),
      sendBlock,
    });

    expect(block.account).toBe(frontierBlock.account);
    expect(block.link).toBe(hashBlock({ block: sendBlock }));
    expect(block.representative).toBe(TestData.Valid.Representative3());
  });

  test("returns a successful result in non-throwing mode", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });
    const result = createReceiveBlock({
      amount: 1000n,
      frontierBlock: TestData.Valid.StateBlock2(),
      sendBlock,
      throwOnError: false,
    });

    assert(result.success);
  });

  test("wraps balance calculation errors as their own block error", () => {
    const frontierBlock = {
      ...TestData.Valid.StateBlock1(),
      balance: RawAmounts.max().toString(),
    };
    const sendBlock = createSendBlock({
      amount: "1",
      destination: frontierBlock.account,
      frontierBlock: TestData.Valid.StateBlock2(),
    });

    const result = createReceiveBlock({ amount: "1", frontierBlock, sendBlock, throwOnError: false });

    assert(!result.success);
    expectErrorCode(result.error, BlockErrorCode.BalanceOutOfRange);
    expectErrorCode(result.error.cause, MathErrorCode.ResultOutOfRange);
  });

  test("rejects a send block for another account or with an inconsistent link", () => {
    const wrongDestinationBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account3(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });
    const wrongDestinationResult = createReceiveBlock({
      amount: "1000",
      frontierBlock: TestData.Valid.StateBlock2(),
      sendBlock: wrongDestinationBlock,
      throwOnError: false,
    });
    assert(!wrongDestinationResult.success);
    expectErrorCode(wrongDestinationResult.error, BlockErrorCode.SendDestinationMismatch);

    const inconsistentSendBlock = {
      ...wrongDestinationBlock,
      link_as_account: TestData.Valid.Account2(),
    };
    expectToThrowErrorCode(
      () =>
        createReceiveBlock({
          amount: "1000",
          frontierBlock: TestData.Valid.StateBlock2(),
          sendBlock: inconsistentSendBlock,
        }),
      BlockErrorCode.SendLinkMismatch
    );
  });

  test("rejects invalid frontier blocks, amounts, send blocks, and signing keys", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account1(),
      frontierBlock: TestData.Valid.StateBlock2(),
    });
    const incompleteFrontierBlock = TestData.Valid.StateBlock1();
    delete (incompleteFrontierBlock as { work?: string }).work;

    const incompleteFrontierResult = createReceiveBlock({
      amount: "1000",
      frontierBlock: incompleteFrontierBlock,
      sendBlock,
      throwOnError: false,
    });
    assert(!incompleteFrontierResult.success);
    expectErrorCode(incompleteFrontierResult.error, BlockErrorCode.InvalidFrontierBlock);

    const inconsistentFrontierBlock = {
      ...TestData.Valid.StateBlock1(),
      link_as_account: TestData.Valid.Account2(),
    };
    expectToThrowErrorCode(
      () =>
        createReceiveBlock({
          amount: "1000",
          frontierBlock: inconsistentFrontierBlock,
          sendBlock,
        }),
      BlockErrorCode.FrontierLinkMismatch
    );

    const zeroAmountResult = createReceiveBlock({
      amount: "0",
      frontierBlock: TestData.Valid.StateBlock1(),
      sendBlock,
      throwOnError: false,
    });
    assert(!zeroAmountResult.success);
    expectErrorCode(zeroAmountResult.error, BlockErrorCode.InvalidAmount);

    expectToThrowErrorCode(
      () =>
        createReceiveBlock({
          amount: "-1",
          frontierBlock: TestData.Valid.StateBlock1(),
          sendBlock,
        }),
      BlockErrorCode.NegativeAmount
    );

    const negativeAmountResult = createReceiveBlock({
      amount: -1n,
      frontierBlock: TestData.Valid.StateBlock1(),
      sendBlock,
      throwOnError: false,
    });
    assert(!negativeAmountResult.success);
    expectErrorCode(negativeAmountResult.error, BlockErrorCode.NegativeAmount);

    const incompleteSendBlock = { ...sendBlock };
    delete (incompleteSendBlock as { signature?: string }).signature;
    const incompleteSendResult = createReceiveBlock({
      amount: "1000",
      frontierBlock: TestData.Valid.StateBlock1(),
      sendBlock: incompleteSendBlock,
      throwOnError: false,
    });
    assert(!incompleteSendResult.success);
    expectErrorCode(incompleteSendResult.error, BlockErrorCode.InvalidSendBlock);

    const mismatchedKeyResult = createReceiveBlock({
      amount: "1000",
      frontierBlock: TestData.Valid.StateBlock1(),
      sendBlock,
      privateKey: TestData.Valid.PrivateKey2(),
      throwOnError: false,
    });
    assert(!mismatchedKeyResult.success);
    expectErrorCode(mismatchedKeyResult.error, BlockErrorCode.SignBlockFailed);
    expectErrorCode(mismatchedKeyResult.error.cause, CryptoErrorCode.KeyAccountMismatch);
  });
});
