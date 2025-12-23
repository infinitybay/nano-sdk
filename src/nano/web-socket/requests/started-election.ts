import { z } from "zod";

import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type StartedElectionRequest = z.infer<ReturnType<typeof StartedElectionRequest>>;
export const StartedElectionRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("started_election"),
  });
