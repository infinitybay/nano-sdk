import { z } from "zod";

export type BooleanString = z.infer<ReturnType<typeof BooleanString>>;
export const BooleanString = () => z.union([z.literal("true"), z.literal("false")]);
