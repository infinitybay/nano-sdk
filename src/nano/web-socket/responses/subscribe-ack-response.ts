import { z } from "zod";

import { TimestampString } from "../../types/timestamp";

export type SubscribeAckResponse = z.infer<ReturnType<typeof SubscribeAckResponse>>;
export const SubscribeAckResponse = () =>
  z.object({
    ack: z.literal("subscribe"),
    time: TimestampString(),
    id: z.string().optional(),
  });
