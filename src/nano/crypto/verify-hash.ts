import { AccountString } from "../types/account";
import { RawAmountString } from "../types/amount";
import { HashString } from "../types/hash";
import { LinkString } from "../types/link";
import { Result } from "../types/result";
import { hashBlock } from "./hash-block";

type BlockInput = {
  account: AccountString;
  previous: HashString;
  representative: AccountString;
  balance: RawAmountString;
  link: LinkString;
};

type VerifyHashInput = {
  hash: HashString;
  block: BlockInput;
};

export function verifyHash(input: VerifyHashInput): boolean {
  const validatedHash = HashString().safeParse(input.hash);
  if (!validatedHash.success) {
    throw new Error("Invalid hash value.");
  }

  const blockHash = hashBlock(input.block);
  return validatedHash.data === blockHash;
}

export function safeVerifyHash(input: VerifyHashInput): Result<boolean> {
  try {
    return { success: true, data: verifyHash(input) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err : new Error("Unexpected error.") };
  }
}
