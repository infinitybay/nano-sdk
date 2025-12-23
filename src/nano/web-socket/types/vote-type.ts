import { z } from "zod";

export type VoteType = z.infer<ReturnType<typeof VoteType>>;
export const VoteType = () =>
  z.union([
    z.literal("ignored"),
    z.literal("invalid"),
    z.literal("indeterminate"),
    z.literal("late"),
    z.literal("replay"),
    z.literal("vote"),
  ]);
