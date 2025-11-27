import { z } from "zod";

export type Action = z.infer<ReturnType<typeof Action>>;
export const Action = () => z.literal("subscribe").or(z.literal("unsubscribe")).or(z.literal("update"));
