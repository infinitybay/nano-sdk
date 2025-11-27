import { z } from "zod";

import { TimestampString } from "../../types/timestamp";
import { Topic } from "../types/topic";

export type TopicResponse = z.infer<ReturnType<typeof TopicResponse>>;
export const TopicResponse = () =>
  z.object({
    topic: Topic(),
    time: TimestampString(),
  });
