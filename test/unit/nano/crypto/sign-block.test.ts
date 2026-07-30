import { signBlock } from "../../../../src/nano/crypto/sign-block";
import { TestData } from "../../test-data";

describe("signBlock function", () => {
  test("signs a valid state block with its account private key", () => {
    expect(
      signBlock({
        block: TestData.Valid.StateBlock1(),
        privateKey: TestData.Valid.PrivateKey1(),
        throwOnError: true,
      })
    ).toBe(TestData.Valid.Signature1());
  });

  test("returns a result when non-throwing mode is requested", () => {
    const result = signBlock({
      block: TestData.Valid.StateBlock2(),
      privateKey: TestData.Valid.PrivateKey2(),
      throwOnError: false,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(TestData.Valid.Signature2());
    }
  });

  test("rejects a private key belonging to another account", () => {
    const result = signBlock({
      block: TestData.Valid.StateBlock1(),
      privateKey: TestData.Valid.PrivateKey2(),
      throwOnError: false,
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid state blocks and mismatched link_as_account values", () => {
    const missingSignature = { ...TestData.Valid.StateBlock1() };
    delete (missingSignature as { signature?: string }).signature;

    const invalidBlockResult = signBlock({
      block: missingSignature,
      privateKey: TestData.Valid.PrivateKey1(),
      throwOnError: false,
    });
    expect(invalidBlockResult.success).toBe(false);

    const mismatchedLinkResult = signBlock({
      block: {
        ...TestData.Valid.StateBlock1(),
        link_as_account: TestData.Valid.Account2(),
      },
      privateKey: TestData.Valid.PrivateKey1(),
      throwOnError: false,
    });
    expect(mismatchedLinkResult.success).toBe(false);
  });

  test("throws by default when signing fails", () => {
    expect(() =>
      signBlock({
        block: TestData.Valid.StateBlock1(),
        privateKey: TestData.Valid.PrivateKey2(),
      })
    ).toThrow();
  });
});
