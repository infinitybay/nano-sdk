import { CryptoError } from "../../../../src/nano/crypto/crypto-error";
import { CryptoErrorCode } from "../../../../src/nano/crypto/crypto-error-code";
import { expectErrorCode } from "../../../expect";

describe("CryptoError class", () => {
  test("preserves its code and cause", () => {
    const cause = new Error("cause");
    const error = new CryptoError(CryptoErrorCode.ComputeBlockHashFailed, "failure", { cause });

    expectErrorCode(error, CryptoErrorCode.ComputeBlockHashFailed);
    expect(error).toMatchObject({ cause, name: "CryptoError" });
  });
});
