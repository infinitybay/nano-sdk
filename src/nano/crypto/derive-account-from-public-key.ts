import { blake2b } from "blakejs";

import { AccountPrefix, AccountString } from "../types/account";
import { NonThrowing } from "../types/non-throwing";
import { PublicKeyString } from "../types/public-key";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { encodeBase32 } from "./conversion/base32-converter";
import { publicKeyToBytes } from "./conversion/public-key-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

export type DeriveAccountFromPublicKeyParams = {
  publicKey: PublicKeyString;
  accountPrefix?: AccountPrefix;
};

export type DeriveAccountFromPublicKeyResult = Result<
  AccountString,
  CryptoError<
    | CryptoErrorCode.CalculateAccountChecksumFailed
    | CryptoErrorCode.EncodeChecksumBase32Failed
    | CryptoErrorCode.EncodePublicKeyBase32Failed
    | CryptoErrorCode.InvalidAccountPrefix
    | CryptoErrorCode.InvalidDerivedAccount
    | CryptoErrorCode.InvalidPublicKey
    | CryptoErrorCode.PublicKeyToBytesFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function deriveAccountFromPublicKey(
  params: DeriveAccountFromPublicKeyParams & NonThrowing
): DeriveAccountFromPublicKeyResult;
export function deriveAccountFromPublicKey(params: DeriveAccountFromPublicKeyParams & Throwing): AccountString;
export function deriveAccountFromPublicKey(
  params: DeriveAccountFromPublicKeyParams & (Throwing | NonThrowing)
): AccountString | DeriveAccountFromPublicKeyResult;
export function deriveAccountFromPublicKey(params: DeriveAccountFromPublicKeyParams & (Throwing | NonThrowing)) {
  const result = ((): DeriveAccountFromPublicKeyResult => {
    try {
      const validatedPublicKey = PublicKeyString().safeParse(params.publicKey);
      if (!validatedPublicKey.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidPublicKey, "Invalid public key value."));
      }

      const accountPrefix = params.accountPrefix ?? "nano_";
      const validatedAccountPrefix = AccountPrefix({ prefix: accountPrefix }).safeParse(accountPrefix);
      if (!validatedAccountPrefix.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidAccountPrefix, "Invalid account prefix value."));
      }

      const publicKeyBytes = publicKeyToBytes({ publicKey: validatedPublicKey.data, throwOnError: false });
      if (!publicKeyBytes.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.PublicKeyToBytesFailed, "Failed to convert public key to bytes.", {
            cause: publicKeyBytes.error,
          })
        );
      }

      let checksumBytes: Uint8Array;
      try {
        checksumBytes = blake2b(publicKeyBytes.data, undefined, 5).reverse();
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.CalculateAccountChecksumFailed, "Failed to determine checksum bytes.", {
            cause: err,
          })
        );
      }

      const encodedPublicKeyResult = encodeBase32({ bytes: publicKeyBytes.data, throwOnError: false });
      if (!encodedPublicKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.EncodePublicKeyBase32Failed, "Failed to encode public key bytes.", {
            cause: encodedPublicKeyResult.error,
          })
        );
      }

      const encodedChecksumResult = encodeBase32({ bytes: checksumBytes, throwOnError: false });
      if (!encodedChecksumResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.EncodeChecksumBase32Failed, "Failed to encode checksum bytes.", {
            cause: encodedChecksumResult.error,
          })
        );
      }

      const accountResult = AccountString().safeParse(
        validatedAccountPrefix.data + encodedPublicKeyResult.data + encodedChecksumResult.data
      );
      if (!accountResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.InvalidDerivedAccount, "Failed to derive account from public key.")
        );
      }

      return Result.ok(accountResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
