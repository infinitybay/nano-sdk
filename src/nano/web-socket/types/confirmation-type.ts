import { z } from "zod";

export type ConfirmationType = z.infer<ReturnType<typeof ConfirmationType>>;
export const ConfirmationType = () =>
  z
    .literal("active")
    .or(z.literal("active_confirmation_height"))
    .or(z.literal("active_quorum"))
    .or(z.literal("all"))
    .or(z.literal("inactive"));
