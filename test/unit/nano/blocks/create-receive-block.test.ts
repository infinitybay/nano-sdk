import { createReceiveBlock } from "../../../../src/nano/blocks/create-receive-block";
import { createSendBlock } from "../../../../src/nano/blocks/create-send-block";
import { deriveAccountFromLink } from "../../../../src/nano/crypto/derive-account-from-link";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
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

    expect(result.success).toBe(true);
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
    expect(wrongDestinationResult.success).toBe(false);

    const inconsistentSendBlock = {
      ...wrongDestinationBlock,
      link_as_account: TestData.Valid.Account2(),
    };
    expect(() =>
      createReceiveBlock({
        amount: "1000",
        frontierBlock: TestData.Valid.StateBlock2(),
        sendBlock: inconsistentSendBlock,
      })
    ).toThrow("Send block link and link_as_account do not match.");
  });

  test("rejects invalid frontier blocks, amounts, send blocks, and signing keys", () => {
    const sendBlock = createSendBlock({
      amount: "1000",
      destination: TestData.Valid.Account1(),
      frontierBlock: TestData.Valid.StateBlock2(),
    });
    const incompleteFrontierBlock = TestData.Valid.StateBlock1();
    delete (incompleteFrontierBlock as { work?: string }).work;

    expect(
      createReceiveBlock({
        amount: "1000",
        frontierBlock: incompleteFrontierBlock,
        sendBlock,
        throwOnError: false,
      }).success
    ).toBe(false);

    const inconsistentFrontierBlock = {
      ...TestData.Valid.StateBlock1(),
      link_as_account: TestData.Valid.Account2(),
    };
    expect(() =>
      createReceiveBlock({
        amount: "1000",
        frontierBlock: inconsistentFrontierBlock,
        sendBlock,
      })
    ).toThrow("Frontier block link and link_as_account do not match.");

    expect(
      createReceiveBlock({
        amount: "0",
        frontierBlock: TestData.Valid.StateBlock1(),
        sendBlock,
        throwOnError: false,
      }).success
    ).toBe(false);

    expect(() =>
      createReceiveBlock({
        amount: "-1",
        frontierBlock: TestData.Valid.StateBlock1(),
        sendBlock,
      })
    ).toThrow("Invalid amount: negative raw amounts are not allowed.");

    const negativeAmountResult = createReceiveBlock({
      amount: -1n,
      frontierBlock: TestData.Valid.StateBlock1(),
      sendBlock,
      throwOnError: false,
    });
    expect(negativeAmountResult.success).toBe(false);
    if (!negativeAmountResult.success) {
      expect(negativeAmountResult.error.message).toBe("Invalid amount: negative raw amounts are not allowed.");
    }

    const incompleteSendBlock = { ...sendBlock };
    delete (incompleteSendBlock as { signature?: string }).signature;
    expect(
      createReceiveBlock({
        amount: "1000",
        frontierBlock: TestData.Valid.StateBlock1(),
        sendBlock: incompleteSendBlock,
        throwOnError: false,
      }).success
    ).toBe(false);

    expect(
      createReceiveBlock({
        amount: "1000",
        frontierBlock: TestData.Valid.StateBlock1(),
        sendBlock,
        privateKey: TestData.Valid.PrivateKey2(),
        throwOnError: false,
      }).success
    ).toBe(false);
  });
});
