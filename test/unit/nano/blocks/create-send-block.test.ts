import { BlockErrorCode } from "../../../../src/nano/blocks/block-error-code";
import { createSendBlock } from "../../../../src/nano/blocks/create-send-block";
import { CryptoErrorCode } from "../../../../src/nano/crypto/crypto-error-code";
import { derivePublicKeyFromAccount } from "../../../../src/nano/crypto/derive-public-key-from-account";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { signBlock } from "../../../../src/nano/crypto/sign-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { MathErrorCode } from "../../../../src/nano/math/math-error-code";
import { SignatureStrings } from "../../../../src/nano/types/signature";
import { WorkStrings } from "../../../../src/nano/types/work";
import { assert } from "../../../assert";
import { expectErrorCode, expectToThrowErrorCode } from "../../../expect";
import { TestData } from "../../test-data";

describe("createSendBlock function", () => {
  test("creates an unsigned send block from the frontier state block without mutating it", () => {
    const frontierBlock = TestData.Valid.StateBlock1();
    const frontierBlockSnapshot = { ...frontierBlock };
    const amount = "1000";

    const block = createSendBlock({
      amount,
      destination: TestData.Valid.Account2(),
      frontierBlock,
      throwOnError: true,
    });

    expect(block).toEqual({
      type: "state",
      account: frontierBlock.account,
      previous: hashBlock({ block: frontierBlock }),
      representative: frontierBlock.representative,
      balance: (BigInt(frontierBlock.balance) - BigInt(amount)).toString(),
      link: derivePublicKeyFromAccount({ account: TestData.Valid.Account2() }),
      link_as_account: TestData.Valid.Account2(),
      signature: SignatureStrings.zero(),
      work: WorkStrings.zero(),
    });
    expect(frontierBlock).toEqual(frontierBlockSnapshot);
  });

  test("uses an explicit representative and optionally signs the new block", () => {
    const block = createSendBlock({
      amount: 1000n,
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      privateKey: TestData.Valid.PrivateKey1(),
      representative: TestData.Valid.Representative2(),
    });

    expect(block.representative).toBe(TestData.Valid.Representative2());
    expect(block.signature).not.toBe(SignatureStrings.zero());
    expect(block.work).toBe(WorkStrings.zero());
    expect(verifyBlock({ block })).toBe(true);
  });

  test("supports signing the returned block later", () => {
    const block = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
    });
    expect(block.signature).toBe(SignatureStrings.zero());

    block.signature = signBlock({
      block,
      privateKey: TestData.Valid.PrivateKey1(),
    });

    expect(verifyBlock({ block })).toBe(true);
  });

  test("returns successful and failed results in non-throwing mode", () => {
    const successResult = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      throwOnError: false,
    });
    assert(successResult.success);

    const insufficientBalanceResult = createSendBlock({
      amount: (BigInt(TestData.Valid.StateBlock1().balance) + 1n).toString(),
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      throwOnError: false,
    });
    assert(!insufficientBalanceResult.success);
    expectErrorCode(insufficientBalanceResult.error, BlockErrorCode.InsufficientBalance);
    expectErrorCode(insufficientBalanceResult.error.cause, MathErrorCode.NegativeResult);

    const mismatchedKeyResult = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      privateKey: TestData.Valid.PrivateKey2(),
      throwOnError: false,
    });
    assert(!mismatchedKeyResult.success);
    expectErrorCode(mismatchedKeyResult.error, BlockErrorCode.SignBlockFailed);
    expectErrorCode(mismatchedKeyResult.error.cause, CryptoErrorCode.KeyAccountMismatch);
  });

  test("rejects invalid inputs in throwing and non-throwing modes", () => {
    const incompleteFrontierBlock = TestData.Valid.StateBlock1();
    delete (incompleteFrontierBlock as { signature?: string }).signature;

    expectToThrowErrorCode(
      () =>
        createSendBlock({
          amount: "1000",
          destination: TestData.Valid.Account2(),
          frontierBlock: incompleteFrontierBlock,
        }),
      BlockErrorCode.InvalidFrontierBlock
    );

    const inconsistentFrontierBlock = {
      ...TestData.Valid.StateBlock1(),
      link_as_account: TestData.Valid.Account2(),
    };
    expectToThrowErrorCode(
      () =>
        createSendBlock({
          amount: "1000",
          destination: TestData.Valid.Account2(),
          frontierBlock: inconsistentFrontierBlock,
        }),
      BlockErrorCode.FrontierLinkMismatch
    );

    const zeroAmountResult = createSendBlock({
      amount: "0",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      throwOnError: false,
    });
    assert(!zeroAmountResult.success);
    expectErrorCode(zeroAmountResult.error, BlockErrorCode.InvalidAmount);

    expectToThrowErrorCode(
      () =>
        createSendBlock({
          amount: "-1",
          destination: TestData.Valid.Account2(),
          frontierBlock: TestData.Valid.StateBlock1(),
        }),
      BlockErrorCode.NegativeAmount
    );

    const negativeAmountResult = createSendBlock({
      amount: -1n,
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      throwOnError: false,
    });
    assert(!negativeAmountResult.success);
    expectErrorCode(negativeAmountResult.error, BlockErrorCode.NegativeAmount);

    const invalidDestinationResult = createSendBlock({
      amount: "1000",
      destination: TestData.Invalid.Account.ChecksumMismatch(),
      frontierBlock: TestData.Valid.StateBlock1(),
      throwOnError: false,
    });
    assert(!invalidDestinationResult.success);
    expectErrorCode(invalidDestinationResult.error, BlockErrorCode.InvalidDestination);
  });
});
