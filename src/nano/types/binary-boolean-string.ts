import { z } from "zod";

export type BinaryBooleanString = z.infer<ReturnType<typeof BinaryBooleanString>>;
export const BinaryBooleanString = () => z.union([z.literal("0"), z.literal("1")]);
