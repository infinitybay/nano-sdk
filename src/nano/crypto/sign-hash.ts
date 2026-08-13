import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { Throwing } from "../types/throwing";
import { hashToBytes } from "./conversion/hash-converter";
import { privateKeyToBytes } from "./conversion/private-key-converter";
import { bytesToSignature } from "./conversion/signature-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type SignHashParams = {
  hash: HashString;
  privateKey: PrivateKeyString;
};

export type SignHashResult = Result<
  SignatureString,
  CryptoError<
    | CryptoErrorCode.BytesToSignatureFailed
    | CryptoErrorCode.CreateSignatureFailed
    | CryptoErrorCode.HashToBytesFailed
    | CryptoErrorCode.PrivateKeyToBytesFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function signHash(params: SignHashParams & NonThrowing): SignHashResult;
export function signHash(params: SignHashParams & Throwing): SignatureString;
export function signHash(params: SignHashParams & (Throwing | NonThrowing)): SignatureString | SignHashResult;
export function signHash(params: SignHashParams & (Throwing | NonThrowing)) {
  const result = ((): SignHashResult => {
    try {
      const hashBytes = hashToBytes({ hash: params.hash, throwOnError: false });
      if (!hashBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HashToBytesFailed, "Failed to convert hash to bytes.", {
            cause: hashBytes.error,
          })
        );
      }

      const privateKeyBytes = privateKeyToBytes({ privateKey: params.privateKey, throwOnError: false });
      if (!privateKeyBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.PrivateKeyToBytesFailed, "Failed to convert private key to bytes.", {
            cause: privateKeyBytes.error,
          })
        );
      }

      let signatureBytes: Uint8Array;
      try {
        signatureBytes = Nacl.signDetached(hashBytes.data, privateKeyBytes.data);
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.CreateSignatureFailed, "Failed to create a valid signature.", {
            cause: err,
          })
        );
      }

      const signatureResult = bytesToSignature({ signatureBytes, throwOnError: false });
      if (!signatureResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToSignatureFailed, "Failed to convert signature bytes.", {
            cause: signatureResult.error,
          })
        );
      }

      return Result.ok(signatureResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
