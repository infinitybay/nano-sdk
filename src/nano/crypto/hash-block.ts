import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { HexString } from "../types/hex";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { accountToBytes } from "./conversion/account-converter";
import { bytesToHash, hashToBytes } from "./conversion/hash-converter";
import { hexToBytes } from "./conversion/hex-converter";
import { CryptoError } from "./crypto-error";
import { CryptoErrorCode } from "./crypto-error-code";

type BlockInput = {
  account: AccountString;
  previous: HashString;
  representative: AccountString;
  balance: RawAmountString;
  link: LinkString;
};

export type HashBlockParams = {
  block: BlockInput;
};

export type HashBlockResult = Result<
  HashString,
  CryptoError<
    | CryptoErrorCode.BlockAccountToBytesFailed
    | CryptoErrorCode.BlockBalanceToBytesFailed
    | CryptoErrorCode.BlockLinkToBytesFailed
    | CryptoErrorCode.BlockPreviousToBytesFailed
    | CryptoErrorCode.BlockRepresentativeToBytesFailed
    | CryptoErrorCode.BytesToHashFailed
    | CryptoErrorCode.ComputeBlockHashFailed
    | CryptoErrorCode.InvalidBlockAccount
    | CryptoErrorCode.InvalidBlockBalance
    | CryptoErrorCode.InvalidBlockBalanceHex
    | CryptoErrorCode.InvalidBlockLink
    | CryptoErrorCode.InvalidBlockPrevious
    | CryptoErrorCode.InvalidBlockRepresentative
    | CryptoErrorCode.Unexpected
  >
>;

const STATE_BLOCK_PREAMBLE_BYTES = new Uint8Array(32);
STATE_BLOCK_PREAMBLE_BYTES[31] = 6;

export function hashBlock(params: HashBlockParams & NonThrowing): HashBlockResult;
export function hashBlock(params: HashBlockParams & Throwing): HashString;
export function hashBlock(params: HashBlockParams & (Throwing | NonThrowing)): HashString | HashBlockResult;
export function hashBlock(params: HashBlockParams & (Throwing | NonThrowing)) {
  const result = ((): HashBlockResult => {
    try {
      const validatedAccount = AccountString().safeParse(params.block.account);
      if (!validatedAccount.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBlockAccount, "Invalid block account value."));
      }

      const validatedPrevious = HashString().safeParse(params.block.previous);
      if (!validatedPrevious.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBlockPrevious, "Invalid block previous value."));
      }

      const validatedRepresentative = AccountString().safeParse(params.block.representative);
      if (!validatedRepresentative.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.InvalidBlockRepresentative, "Invalid block representative value.")
        );
      }

      const validatedBalance = RawAmountString().safeParse(params.block.balance);
      if (!validatedBalance.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBlockBalance, "Invalid block balance value."));
      }

      const validatedLink = LinkString().safeParse(params.block.link);
      if (!validatedLink.success) {
        return Result.err(new CryptoError(CryptoErrorCode.InvalidBlockLink, "Invalid block link value."));
      }

      const accountBytesResult = accountToBytes({ account: validatedAccount.data, throwOnError: false });
      if (!accountBytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BlockAccountToBytesFailed, "Failed to convert block account to bytes.", {
            cause: accountBytesResult.error,
          })
        );
      }

      const previousBytesResult = hashToBytes({ hash: validatedPrevious.data, throwOnError: false });
      if (!previousBytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BlockPreviousToBytesFailed, "Failed to convert block previous to bytes.", {
            cause: previousBytesResult.error,
          })
        );
      }

      const representativeBytesResult = accountToBytes({
        account: validatedRepresentative.data,
        throwOnError: false,
      });
      if (!representativeBytesResult.success) {
        return Result.err(
          new CryptoError(
            CryptoErrorCode.BlockRepresentativeToBytesFailed,
            "Failed to convert block representative to bytes.",
            { cause: representativeBytesResult.error }
          )
        );
      }

      const balanceHexResult = HexString().safeParse(BigInt(validatedBalance.data).toString(16).padStart(32, "0"));
      if (!balanceHexResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.InvalidBlockBalanceHex, "Failed to convert balance into hex value.")
        );
      }

      const balanceBytesResult = hexToBytes({ hex: balanceHexResult.data, throwOnError: false });
      if (!balanceBytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BlockBalanceToBytesFailed, "Failed to convert block balance to bytes.", {
            cause: balanceBytesResult.error,
          })
        );
      }

      const linkBytesResult = hexToBytes({ hex: validatedLink.data, throwOnError: false });
      if (!linkBytesResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BlockLinkToBytesFailed, "Failed to convert block link to bytes.", {
            cause: linkBytesResult.error,
          })
        );
      }

      let hashBytes: Uint8Array;
      try {
        const hashContext = blake2bInit(32);
        blake2bUpdate(hashContext, STATE_BLOCK_PREAMBLE_BYTES);
        blake2bUpdate(hashContext, accountBytesResult.data);
        blake2bUpdate(hashContext, previousBytesResult.data);
        blake2bUpdate(hashContext, representativeBytesResult.data);
        blake2bUpdate(hashContext, balanceBytesResult.data);
        blake2bUpdate(hashContext, linkBytesResult.data);
        hashBytes = blake2bFinal(hashContext);
      } catch (err) {
        return Result.err(
          new CryptoError(CryptoErrorCode.ComputeBlockHashFailed, "Failed to compute the block hash.", { cause: err })
        );
      }

      const hashResult = bytesToHash({ hashBytes, throwOnError: false });
      if (!hashResult.success) {
        return Result.err(
          new CryptoError(CryptoErrorCode.BytesToHashFailed, "Failed to convert hash bytes to a hash.", {
            cause: hashResult.error,
          })
        );
      }

      return Result.ok(hashResult.data);
    } catch (e) {
      return Result.err(new CryptoError(CryptoErrorCode.Unexpected, "Unexpected error.", { cause: e }));
    }
  })();

  return Result.unwrap(result, params.throwOnError);
}
