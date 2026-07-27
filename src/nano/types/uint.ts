import { z } from "zod";

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
    .regex(/^(0|[1-9]\d*)$/, "Invalid unsigned integer")
    .refine((val) => UInt().safeParse(Number(val)).success, {
      message: "Invalid unsigned integer",
    });
