import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { AccountString } from "../types/account";
import { Amount, AmountUnit, RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { HexString } from "../types/hex";
import { LinkString } from "../types/link";
import { NonThrowing } from "../types/non-throwing";
import { Result } from "../types/result";
import { Throwing } from "../types/throwing";
import { accountToBytes } from "./conversion/account-converter";
import { bytesToHash, hashToBytes } from "./conversion/hash-converter";
import { hexToBytes } from "./conversion/hex-converter";

type HashBlockParams = {
  account: AccountString;
  previous: HashString;
  representative: AccountString;
  balance: RawAmountString;
  link: LinkString;
} & (Throwing | NonThrowing);

const STATE_BLOCK_PREAMBLE_BYTES = new Uint8Array(32);
STATE_BLOCK_PREAMBLE_BYTES[31] = 6;

function hashBlockThrowing(params: HashBlockParams & Throwing): HashString {
  const validatedAccount = AccountString().safeParse(params.account);
  if (!validatedAccount.success) {
    throw new Error("Invalid account value.");
  }

  const validatedPrevious = HashString().safeParse(params.previous);
  if (!validatedPrevious.success) {
    throw new Error("Invalid previous value.");
  }

  const validatedRepresentative = AccountString().safeParse(params.representative);
  if (!validatedRepresentative.success) {
    throw new Error("Invalid representative value.");
  }

  const validatedBalance = RawAmountString().safeParse(params.balance);
  if (!validatedBalance.success) {
    throw new Error("Invalid balance value.");
  }

  const balanceResult = Amount.safeParse(validatedBalance.data, AmountUnit.Raw);
  if (!balanceResult.success) {
    throw new Error("Invalid balance value.");
  }

  const validatedLink = LinkString().safeParse(params.link);
  if (!validatedLink.success) {
    throw new Error("Invalid link value.");
  }

  const accountBytes = accountToBytes({ account: validatedAccount.data, throwOnError: true });
  const previousBytes = hashToBytes({ hash: validatedPrevious.data, throwOnError: true });
  const representativeBytes = accountToBytes({ account: validatedRepresentative.data, throwOnError: true });

  const balanceHexResult = HexString().safeParse(balanceResult.data.getInternalValue().toString(16).padStart(32, "0"));
  if (!balanceHexResult.success) {
    throw new Error("Failed to convert balance into hex value.");
  }

  const balanceBytes = hexToBytes({ hex: balanceHexResult.data, throwOnError: true });

  const linkBytes = hexToBytes({ hex: validatedLink.data, throwOnError: true });

  try {
    const hashContext = blake2bInit(32);
    blake2bUpdate(hashContext, STATE_BLOCK_PREAMBLE_BYTES);
    blake2bUpdate(hashContext, accountBytes);
    blake2bUpdate(hashContext, previousBytes);
    blake2bUpdate(hashContext, representativeBytes);
    blake2bUpdate(hashContext, balanceBytes);
    blake2bUpdate(hashContext, linkBytes);
    const hashBytes = blake2bFinal(hashContext);
    return bytesToHash({ hashBytes, throwOnError: true });
  } catch (_err) {
    throw new Error("Failed to compute hash.");
  }
}

function hashBlockNonThrowing(params: HashBlockParams & NonThrowing): Result<HashString> {
  try {
    return {
      success: true,
      data: hashBlockThrowing({ ...params, throwOnError: true }),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Unexpected error."),
    };
  }
}

export function hashBlock(params: HashBlockParams & NonThrowing): Result<HashString>;
export function hashBlock(params: HashBlockParams & Throwing): HashString;
export function hashBlock(params: HashBlockParams): HashString | Result<HashString>;
export function hashBlock(params: HashBlockParams) {
  if (params.throwOnError === true) {
    return hashBlockThrowing({ ...params, throwOnError: true });
  } else {
    return hashBlockNonThrowing({ ...params, throwOnError: false });
  }
}
