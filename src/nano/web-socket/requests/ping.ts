import { z } from "zod";

import { AckRequest } from "./ack";

export type PingRequest = z.infer<ReturnType<typeof PingRequest>>;
export const PingRequest = () =>
  AckRequest().extend({
    action: z.literal("ping"),
  });
