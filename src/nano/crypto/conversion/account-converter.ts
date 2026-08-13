import { AccountString } from "../../types/account";
import { NonThrowing } from "../../types/non-throwing";
import { Result } from "../../types/result";
import { Throwing } from "../../types/throwing";
import { CryptoError } from "../crypto-error";
import { CryptoErrorCode } from "../crypto-error-code";
import { deriveAccountFromPublicKey } from "../derive-account-from-public-key";
import { decodeBase32 } from "./base32-converter";
import { bytesToPublicKey } from "./public-key-converter";

const encodedPublicKeyLength = 52;
const encodedChecksumLength = 8;

export type AccountToBytesParams = {
  account: AccountString;
};

export type AccountToBytesResult = Result<
  Uint8Array,
  CryptoError<CryptoErrorCode.DecodeBase32Failed | CryptoErrorCode.InvalidAccount | CryptoErrorCode.Unexpected>
>;

export function accountToBytes(params: AccountToBytesParams & NonThrowing): AccountToBytesResult;
export function accountToBytes(params: AccountToBytesParams & Throwing): Uint8Array;
export function accountToBytes(
  params: AccountToBytesParams & (Throwing | NonThrowing)
): Uint8Array | AccountToBytesResult;
export function accountToBytes(params: AccountToBytesParams & (Throwing | NonThrowing)) {
  const result = ((): AccountToBytesResult => {
    try {
      const validatedAccount = AccountString().safeParse(params.account);
      if (!validatedAccount.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidAccount, "Invalid account."));
      }

      const publicKeyStartIndex = validatedAccount.data.length - encodedPublicKeyLength - encodedChecksumLength;
      const publicKeyEndIndex = validatedAccount.data.length - encodedChecksumLength;
      const encodedPublicKey = validatedAccount.data.substring(publicKeyStartIndex, publicKeyEndIndex);
      const decodedResult = decodeBase32({ encoded: encodedPublicKey, throwOnError: false });
      if (!decodedResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.DecodeBase32Failed, "Failed to decode the account public key.", {
            cause: decodedResult.error,
          })
        );
      }

      return Result.ok(decodedResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}

export type BytesToAccountParams = {
  publicKeyBytes: Uint8Array;
};

export type BytesToAccountResult = Result<
  AccountString,
  CryptoError<
    | CryptoErrorCode.BytesToPublicKeyFailed
    | CryptoErrorCode.DeriveAccountFromPublicKeyFailed
    | CryptoErrorCode.Unexpected
  >
>;

export function bytesToAccount(params: BytesToAccountParams & NonThrowing): BytesToAccountResult;
export function bytesToAccount(params: BytesToAccountParams & Throwing): AccountString;
export function bytesToAccount(
  params: BytesToAccountParams & (Throwing | NonThrowing)
): AccountString | BytesToAccountResult;
export function bytesToAccount(params: BytesToAccountParams & (Throwing | NonThrowing)) {
  const result = ((): BytesToAccountResult => {
    try {
      const publicKeyResult = bytesToPublicKey({ publicKeyBytes: params.publicKeyBytes, throwOnError: false });
      if (!publicKeyResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToPublicKeyFailed, "Failed to convert bytes to a public key.", {
            cause: publicKeyResult.error,
          })
        );
      }

      const accountResult = deriveAccountFromPublicKey({ publicKey: publicKeyResult.data, throwOnError: false });
      if (!accountResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.DeriveAccountFromPublicKeyFailed,
            "Failed to derive account from public key.",
            { cause: accountResult.error }
          )
        );
      }

      return Result.ok(accountResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
