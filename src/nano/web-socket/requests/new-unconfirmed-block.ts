import { z } from "zod";

import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type NewUnconfirmedBlockRequest = z.infer<ReturnType<typeof NewUnconfirmedBlockRequest>>;
export const NewUnconfirmedBlockRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("new_unconfirmed_block"),
  });
