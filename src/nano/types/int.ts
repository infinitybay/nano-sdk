import z from "zod";

export const IntBounds = {
  min: () => Number.MIN_SAFE_INTEGER,
  max: () => Number.MAX_SAFE_INTEGER,
};

export type Int = z.infer<ReturnType<typeof Int>>;
export const Int = () => z.int().min(IntBounds.min()).max(IntBounds.max());

export type IntString = z.infer<ReturnType<typeof IntString>>;
export const IntString = () =>
  z
    .string()
    .regex(/^(0|-?[1-9]\d*)$/, "Invalid integer")
    .refine((val) => Int().safeParse(Number(val)).success, {
      message: "Invalid integer",
    });
