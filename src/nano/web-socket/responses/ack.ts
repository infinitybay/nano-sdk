import { z } from "zod";

import { TimestampString } from "../../types/timestamp";
import { Action } from "../types/action";

export type AckResponse = z.infer<ReturnType<typeof AckResponse>>;
export const AckResponse = () =>
  z.object({
    ack: Action().or(z.literal("pong")),
    time: TimestampString(),
    id: z.string().optional(),
  });
