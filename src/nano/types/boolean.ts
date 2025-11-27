import { z } from "zod";

export type BooleanString = z.infer<ReturnType<typeof BooleanString>>;
export const BooleanString = () =>
  z
    .string()
    .refine(
      (val) =>
        z.union([z.literal("0"), z.literal("1"), z.literal("false"), z.literal("true")]).safeParse(val.toLowerCase())
          .success,
      {
        message: "Invalid boolean string",
      }
    );
