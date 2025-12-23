import { z } from "zod";

import { HashString } from "../../types/hash";
import { TimestampString } from "../../types/timestamp";

export type StoppedElectionMessage = z.infer<ReturnType<typeof StoppedElectionMessage>>;
export const StoppedElectionMessage = () =>
  z.object({
    hash: HashString(),
  });

export type StoppedElectionResponse = z.infer<ReturnType<typeof StoppedElectionResponse>>;
export const StoppedElectionResponse = () =>
  z.object({
    topic: z.literal("stopped_election"),
    time: TimestampString(),
    message: StoppedElectionMessage(),
  });
