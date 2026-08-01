import { createChangeBlock } from "../../../../src/nano/blocks/create-change-block";
import { deriveAccountFromLink } from "../../../../src/nano/crypto/derive-account-from-link";
import { hashBlock } from "../../../../src/nano/crypto/hash-block";
import { verifyBlock } from "../../../../src/nano/crypto/verify-block";
import { HashStrings } from "../../../../src/nano/types/hash";
import { SignatureStrings } from "../../../../src/nano/types/signature";
import { WorkStrings } from "../../../../src/nano/types/work";
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

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.signature).toBe(SignatureStrings.zero());
    }
  });

  test("rejects invalid previous blocks, representatives, and signing keys", () => {
    const frontierBlock = TestData.Valid.StateBlock1();

    const incompleteFrontierBlock = { ...frontierBlock };
    delete (incompleteFrontierBlock as { work?: string }).work;
    expect(
      createChangeBlock({
        frontierBlock: incompleteFrontierBlock,
        representative: TestData.Valid.Representative2(),
        throwOnError: false,
      }).success
    ).toBe(false);

    const inconsistentFrontierBlock = {
      ...frontierBlock,
      link_as_account: TestData.Valid.Account2(),
    };
    expect(() =>
      createChangeBlock({
        frontierBlock: inconsistentFrontierBlock,
        representative: TestData.Valid.Representative2(),
      })
    ).toThrow("Frontier block link and link_as_account do not match.");

    expect(
      createChangeBlock({
        frontierBlock,
        representative: TestData.Invalid.Account.ChecksumMismatch(),
        throwOnError: false,
      }).success
    ).toBe(false);

    expect(
      createChangeBlock({
        frontierBlock,
        representative: TestData.Valid.Representative2(),
        privateKey: TestData.Valid.PrivateKey2(),
        throwOnError: false,
      }).success
    ).toBe(false);
  });
});
