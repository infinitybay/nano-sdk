import { z } from "zod";

export const TimestampBounds = {
  min: () => 0,
  max: () => Number.MAX_SAFE_INTEGER,
};

export type Timestamp = z.infer<ReturnType<typeof Timestamp>>;
export const Timestamp = () => z.int().min(TimestampBounds.min()).max(TimestampBounds.max());

export type TimestampString = z.infer<ReturnType<typeof TimestampString>>;
export const TimestampString = () =>
  z
    .string()
    .regex(/^(0|[1-9]\d*)$/, "Invalid timestamp")
    .refine((val) => Timestamp().safeParse(Number(val)).success, {
      message: "Invalid timestamp",
    });
