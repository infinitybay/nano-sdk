import { z } from "zod";

import { Action } from "../types/action";

export type AckRequest = z.infer<ReturnType<typeof AckRequest>>;
export const AckRequest = () =>
  z.object({
    action: Action().or(z.literal("ping")),
    ack: z.boolean().optional(),
    id: z.string().optional(),
  });
