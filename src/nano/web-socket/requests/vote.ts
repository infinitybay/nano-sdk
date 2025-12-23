import { z } from "zod";

import { AccountString } from "../../types/account";
import { BooleanString } from "../../types/boolean";
import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type VoteRequest = z.infer<ReturnType<typeof VoteRequest>>;
export const VoteRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("vote"),
    options: z
      .object({
        representatives: AccountString().array().optional(),
        include_replays: BooleanString().or(z.boolean()).optional(),
        include_indeterminate: BooleanString().or(z.boolean()).optional(),
      })
      .optional(),
  });
