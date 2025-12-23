import { z } from "zod";

import { TimestampString } from "../../types/timestamp";

export type UpdateAckResponse = z.infer<ReturnType<typeof UpdateAckResponse>>;
export const UpdateAckResponse = () =>
  z.object({
    ack: z.literal("update"),
    time: TimestampString(),
    id: z.string().optional(),
  });
