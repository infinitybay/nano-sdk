import { Nacl } from "../types/nacl";
import { NonThrowing } from "../types/non-throwing";
import { PrivateKeyString } from "../types/private-key";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { privateKeyToBytes } from "./conversion/private-key-converter";
import { bytesToPublicKey } from "./conversion/public-key-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type DerivePublicKeyFromPrivateKeyParams = {
  privateKey: PrivateKeyString;
};

export type DerivePublicKeyFromPrivateKeyResult = Result<
  PublicKeyString,
  CryptoError<
    | CryptoErrorCode.BytesToPublicKeyFailed
    | CryptoErrorCode.DerivePublicKeyFailed
    | CryptoErrorCode.InvalidPrivateKey
    | CryptoErrorCode.PrivateKeyToBytesFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function derivePublicKeyFromPrivateKey(
  params: DerivePublicKeyFromPrivateKeyParams & NonThrowing
): DerivePublicKeyFromPrivateKeyResult;
export function derivePublicKeyFromPrivateKey(params: DerivePublicKeyFromPrivateKeyParams & Throwing): PublicKeyString;
export function derivePublicKeyFromPrivateKey(
  params: DerivePublicKeyFromPrivateKeyParams & (Throwing | NonThrowing)
): PublicKeyString | DerivePublicKeyFromPrivateKeyResult;
export function derivePublicKeyFromPrivateKey(params: DerivePublicKeyFromPrivateKeyParams & (Throwing | NonThrowing)) {
  const result = ((): DerivePublicKeyFromPrivateKeyResult => {
    try {
      const validatedPrivateKey = PrivateKeyString().safeParse(params.privateKey);
      if (!validatedPrivateKey.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidPrivateKey, "Invalid private key value."));
      }

      const privateKeyBytes = privateKeyToBytes({ privateKey: validatedPrivateKey.data, throwOnError: false });
      if (!privateKeyBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.PrivateKeyToBytesFailed, "Failed to convert private key to bytes.", {
            cause: privateKeyBytes.error,
          })
        );
      }

      let publicKeyBytes: Uint8Array;
      try {
        publicKeyBytes = Nacl.derivePublicFromSecret(privateKeyBytes.data);
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.DerivePublicKeyFailed, "Failed to derive public key from private key.", {
            cause: err,
          })
        );
      }

      const publicKeyResult = bytesToPublicKey({ publicKeyBytes, throwOnError: false });
      if (!publicKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToPublicKeyFailed, "Failed to convert derived bytes to a public key.", {
            cause: publicKeyResult.error,
          })
        );
      }

      return Result.ok(publicKeyResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
