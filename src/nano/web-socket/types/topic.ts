import { z } from "zod";

export type Topic = z.infer<ReturnType<typeof Topic>>;
export const Topic = () =>
  z
    .literal("bootstrap")
    .or(z.literal("confirmation"))
    .or(z.literal("new_unconfirmed_block"))
    .or(z.literal("started_election"))
    .or(z.literal("stopped_election"))
    .or(z.literal("telemetry"))
    .or(z.literal("work"))
    .or(z.literal("vote"));
