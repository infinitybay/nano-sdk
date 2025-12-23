import { z } from "zod";

import { TimestampString } from "../../types/timestamp";

export type UnsubscribeAckResponse = z.infer<ReturnType<typeof UnsubscribeAckResponse>>;
export const UnsubscribeAckResponse = () =>
  z.object({
    ack: z.literal("unsubscribe"),
    time: TimestampString(),
    id: z.string().optional(),
  });
