import { blake2bFinal, blake2bInit, blake2bUpdate } from "blakejs";

import { AccountString } from "../types/account";
import { Amount, AmountUnit, RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { HexString } from "../types/hex";
import { LinkString } from "../types/link";
import { Result } from "../types/result";
import { accountToBytes } from "./conversion/account-converter";
import { bytesToHash, hashToBytes } from "./conversion/hash-converter";
import { hexToBytes } from "./conversion/hex-converter";

type BlockInput = {
  account: AccountString;
  previous: HashString;
  representative: AccountString;
  balance: RawAmountString;
  link: LinkString;
};

const STATE_BLOCK_PREAMBLE_BYTES = new Uint8Array(32);
STATE_BLOCK_PREAMBLE_BYTES[31] = 6;

export function hashBlock(block: BlockInput): HashString {
  const validatedAccount = AccountString().safeParse(block.account);
  if (!validatedAccount.success) {
    throw new Error("Invalid account value.");
  }

  const validatedPrevious = HashString().safeParse(block.previous);
  if (!validatedPrevious.success) {
    throw new Error("Invalid previous value.");
  }

  const validatedRepresentative = AccountString().safeParse(block.representative);
  if (!validatedRepresentative.success) {
    throw new Error("Invalid representative value.");
  }

  const validatedBalance = RawAmountString().safeParse(block.balance);
  if (!validatedBalance.success) {
    throw new Error("Invalid balance value.");
  }

  const balanceResult = Amount.safeParse(validatedBalance.data, AmountUnit.Raw);
  if (!balanceResult.success) {
    throw new Error("Invalid balance value.");
  }

  const validatedLink = LinkString().safeParse(block.link);
  if (!validatedLink.success) {
    throw new Error("Invalid link value.");
  }

  const accountBytes = accountToBytes(validatedAccount.data);
  const previousBytes = hashToBytes(validatedPrevious.data);
  const representativeBytes = accountToBytes(validatedRepresentative.data);

  const balanceHexResult = HexString().safeParse(balanceResult.data.getInternalValue().toString(16).padStart(32, "0"));
  if (!balanceHexResult.success) {
    throw new Error("Failed to convert balance into hex value.");
  }

  const balanceBytes = hexToBytes(balanceHexResult.data);

  const linkBytes = hexToBytes(validatedLink.data);

  try {
    const hashContext = blake2bInit(32);
    blake2bUpdate(hashContext, STATE_BLOCK_PREAMBLE_BYTES);
    blake2bUpdate(hashContext, accountBytes);
    blake2bUpdate(hashContext, previousBytes);
    blake2bUpdate(hashContext, representativeBytes);
    blake2bUpdate(hashContext, balanceBytes);
    blake2bUpdate(hashContext, linkBytes);
    const hashBytes = blake2bFinal(hashContext);
    return bytesToHash(hashBytes);
  } catch (_err) {
    throw new Error("Failed to compute hash.");
  }
}

export function safeHashBlock(block: BlockInput): Result<HashString> {
  try {
    return { success: true, data: hashBlock(block) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
