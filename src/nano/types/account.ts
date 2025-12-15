import { blake2b } from "blakejs";
import { z } from "zod";

import { decodeBase32 } from "../crypto/conversion/base32-converter";

const defaultAccountPrefix = "nano_";
const encodedPublicKeyLength = 52;
const encodedChecksumLength = 8;

export type AccountPrefix = z.infer<ReturnType<typeof AccountPrefix>>;
export const AccountPrefix = (options: { prefix: string } = { prefix: defaultAccountPrefix }) =>
  z.literal(options.prefix);

export const AccountStringSuperRefine = (val: string, ctx: z.RefinementCtx, expectedPrefix: string) => {
  try {
    const prefix = val.substring(0, val.length - encodedPublicKeyLength - encodedChecksumLength);
    if (!AccountPrefix({ prefix: expectedPrefix }).safeParse(prefix).success) {
      ctx.addIssue({ code: "custom", message: "Invalid prefix" });
      return;
    }

    const checksumBytesResult = decodeBase32({
      encoded: val.substring(val.length - encodedChecksumLength),
      throwOnError: false,
    });
    if (!checksumBytesResult.success) {
      ctx.addIssue({ code: "custom", message: "Invalid format" });
      return;
    }

    const publicKeyBytesResult = decodeBase32({
      encoded: val.substring(
        val.length - encodedPublicKeyLength - encodedChecksumLength,
        val.length - encodedChecksumLength
      ),
      throwOnError: false,
    });
    if (!publicKeyBytesResult.success) {
      ctx.addIssue({ code: "custom", message: "Invalid format" });
      return;
    }

    const computedChecksumBytes = blake2b(publicKeyBytesResult.data, undefined, 5).reverse();
    for (let i = 0; i < checksumBytesResult.data.length; i++) {
      if (checksumBytesResult.data[i] !== computedChecksumBytes[i]) {
        ctx.addIssue({ code: "custom", message: "Checksum mismatch" });
        return;
      }
    }
  } catch (_e) {
    ctx.addIssue({ code: "custom", message: "Invalid format" });
  }
};
export type AccountString = z.infer<ReturnType<typeof AccountString>>;
export const AccountString = (options: { prefix: string } = { prefix: defaultAccountPrefix }) =>
  z.string().superRefine((val: string, ctx: z.RefinementCtx) => AccountStringSuperRefine(val, ctx, options.prefix));
