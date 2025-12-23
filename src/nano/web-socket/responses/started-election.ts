import { z } from "zod";

import { HashString } from "../../types/hash";
import { TimestampString } from "../../types/timestamp";

export type StartedElectionResponse = z.infer<ReturnType<typeof StartedElectionResponse>>;
export const StartedElectionResponse = () =>
  z.object({
    topic: z.literal("started_election"),
    time: TimestampString(),
    message: z.object({
      hash: HashString(),
    }),
  });
