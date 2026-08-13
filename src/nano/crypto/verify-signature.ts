import { HashString } from "../types/hash";
import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { PredicateResult, Result } from "../types/result";
import { SignatureString } from "../types/signature";
import { Throwing } from "../types/throwing";
import { hashToBytes } from "./conversion/hash-converter";
import { publicKeyToBytes } from "./conversion/public-key-converter";
import { signatureToBytes } from "./conversion/signature-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type VerifySignatureParams = {
  hash: HashString;
  publicKey: PublicKeyString;
  signature: SignatureString;
};

export type VerifySignatureResult = PredicateResult<
  "checked",
  "validSignature",
  CryptoError<
    | CryptoErrorCode.HashToBytesFailed
    | CryptoErrorCode.PublicKeyToBytesFailed
    | CryptoErrorCode.SignatureToBytesFailed
    | CryptoErrorCode.Unexpected
    | CryptoErrorCode.VerifyDetachedSignatureFailed
  >
>;

export function verifySignature(params: VerifySignatureParams & NonThrowing): VerifySignatureResult;
export function verifySignature(params: VerifySignatureParams & Throwing): boolean;
export function verifySignature(
  params: VerifySignatureParams & (Throwing | NonThrowing)
): VerifySignatureResult | boolean;
export function verifySignature(params: VerifySignatureParams & (Throwing | NonThrowing)) {
  const result = ((): Result<boolean, Extract<VerifySignatureResult, { checked: false }>["error"]> => {
    try {
      const hashBytes = hashToBytes({ hash: params.hash, throwOnError: false });
      if (!hashBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.HashToBytesFailed, "Failed to convert hash to bytes.", {
            cause: hashBytes.error,
          })
        );
      }

      const publicKeyBytes = publicKeyToBytes({ publicKey: params.publicKey, throwOnError: false });
      if (!publicKeyBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.PublicKeyToBytesFailed, "Failed to convert public key to bytes.", {
            cause: publicKeyBytes.error,
          })
        );
      }

      const signatureBytes = signatureToBytes({ signature: params.signature, throwOnError: false });
      if (!signatureBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.SignatureToBytesFailed, "Failed to convert signature to bytes.", {
            cause: signatureBytes.error,
          })
        );
      }

      try {
        return Result.ok(Nacl.verifyDetached(hashBytes.data, signatureBytes.data, publicKeyBytes.data));
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.VerifyDetachedSignatureFailed, "Failed to verify signature.", { cause: err })
        );
      }
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  if (params.throwOnError === false) {
    if (result.success) {
      return { checked: true, validSignature: result.data };
    }

    return { checked: false, error: result.error };
  }

  return Result.unwrap(result, params.throwOnError);
}
