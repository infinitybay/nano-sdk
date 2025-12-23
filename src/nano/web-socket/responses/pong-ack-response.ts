import { z } from "zod";

import { TimestampString } from "../../types/timestamp";

export type PongAckResponse = z.infer<ReturnType<typeof PongAckResponse>>;
export const PongAckResponse = () =>
  z.object({
    ack: z.literal("pong"),
    time: TimestampString(),
    id: z.string().optional(),
  });
