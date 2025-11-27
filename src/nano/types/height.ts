import { z } from "zod";

export const HeightBounds = {
  min: () => 0,
  max: () => Number.MAX_SAFE_INTEGER,
};

export type Height = z.infer<ReturnType<typeof Height>>;
export const Height = () => z.int().min(HeightBounds.min()).max(HeightBounds.max());

export type HeightString = z.infer<ReturnType<typeof HeightString>>;
export const HeightString = () =>
  z
    .string()
    .regex(/^(0|[1-9]\d*)$/, "Invalid height")
    .refine((val) => Height().safeParse(Number(val)).success, {
      message: "Invalid height",
    });
