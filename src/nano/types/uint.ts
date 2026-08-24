import { z } from "zod";

export const UINT64_MIN = 0n;
export const UINT64_MAX = 18446744073709551615n;
export const UINT64_MAX_STRING = "18446744073709551615";

const UINT_STRING_REGEX = /^(0|[1-9]\d*)$/;
const UINT64_STRING_MAX_LENGTH = UINT64_MAX_STRING.length;

export const UIntBounds = {
  min: () => 0,
  max: () => Number.MAX_SAFE_INTEGER,
};

export type UInt = z.infer<ReturnType<typeof UInt>>;
export const UInt = () => z.int().min(UIntBounds.min()).max(UIntBounds.max());

export type UIntString = z.infer<ReturnType<typeof UIntString>>;
export const UIntString = () =>
  z
    .string()
    .regex(UINT_STRING_REGEX, "Invalid unsigned integer")
    .refine((val) => UInt().safeParse(Number(val)).success, {
      message: "Invalid unsigned integer",
    });

export type UInt64String = z.infer<ReturnType<typeof UInt64String>>;
export const UInt64String = () =>
  z
    .string()
    .regex(UINT_STRING_REGEX, "Invalid unsigned 64-bit integer")
    .refine(
      (val) =>
        val.length <= UINT64_STRING_MAX_LENGTH &&
        UINT_STRING_REGEX.test(val) &&
        BigInt(val) >= UINT64_MIN &&
        BigInt(val) <= UINT64_MAX,
      { message: "Invalid unsigned 64-bit integer" }
    );
