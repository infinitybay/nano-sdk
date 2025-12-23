import { z } from "zod";

import { Action } from "../types/action";
import { AckRequest } from "./ack";

export type StoppedElectionRequest = z.infer<ReturnType<typeof StoppedElectionRequest>>;
export const StoppedElectionRequest = () =>
  AckRequest().extend({
    action: Action(),
    topic: z.literal("stopped_election"),
  });
