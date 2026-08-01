import { createSendBlock } from "../../../../src/nano/blocks/create-send-block";
import { derivePublicKeyFromAccount } from "../../../../src/nano/crypto/derive-public-key-from-account";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { signBlock } from "../../../../src/nano/crypto/sign-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { SignatureStrings } from "../../../../src/nano/types/signature";
import { WorkStrings } from "../../../../src/nano/types/work";
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
    expect(successResult.success).toBe(true);

    const insufficientBalanceResult = createSendBlock({
      amount: (BigInt(TestData.Valid.StateBlock1().balance) + 1n).toString(),
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      throwOnError: false,
    });
    expect(insufficientBalanceResult.success).toBe(false);

    const mismatchedKeyResult = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account2(),
      frontierBlock: TestData.Valid.StateBlock1(),
      privateKey: TestData.Valid.PrivateKey2(),
      throwOnError: false,
    });
    expect(mismatchedKeyResult.success).toBe(false);
  });

  test("rejects invalid inputs in throwing and non-throwing modes", () => {
    const incompleteFrontierBlock = TestData.Valid.StateBlock1();
    delete (incompleteFrontierBlock as { signature?: string }).signature;

    expect(() =>
      createSendBlock({
        amount: "1000",
        destination: TestData.Valid.Account2(),
        frontierBlock: incompleteFrontierBlock,
      })
    ).toThrow("Invalid frontier state block.");

    const inconsistentFrontierBlock = {
      ...TestData.Valid.StateBlock1(),
      link_as_account: TestData.Valid.Account2(),
    };
    expect(() =>
      createSendBlock({
        amount: "1000",
        destination: TestData.Valid.Account2(),
        frontierBlock: inconsistentFrontierBlock,
      })
    ).toThrow("Frontier block link and link_as_account do not match.");

    expect(
      createSendBlock({
        amount: "0",
        destination: TestData.Valid.Account2(),
        frontierBlock: TestData.Valid.StateBlock1(),
        throwOnError: false,
      }).success
    ).toBe(false);

    expect(
      createSendBlock({
        amount: "1000",
        destination: TestData.Invalid.Account.ChecksumMismatch(),
        frontierBlock: TestData.Valid.StateBlock1(),
        throwOnError: false,
      }).success
    ).toBe(false);
  });
});
