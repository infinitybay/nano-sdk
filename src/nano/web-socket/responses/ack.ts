import { z } from "zod";

import { TimestampString } from "../../types";
import { Ack } from "../types/ack";

export type AckResponse = z.infer<ReturnType<typeof AckResponse>>;
export const AckResponse = () =>
  z.object({
    ack: Ack(),
    time: TimestampString(),
    id: z.string().optional(),
  });
