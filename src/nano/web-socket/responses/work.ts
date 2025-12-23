import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { EndpointString } from "../../types/endpoint";
import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";
import { TimestampString } from "../../types/timestamp";
import { WorkString } from "../../types/work";
import { WorkDifficultyString } from "../../types/work-difficulty";

export type WorkMessage = z.infer<ReturnType<typeof WorkMessage>>;
export const WorkMessage = () =>
  z.object({
    success: BooleanString(),
    reason: z.union([z.literal(""), z.literal("cancelled"), z.literal("failure")]),
    duration: TimestampString(),
    request: z.object({
      version: z.literal("work_1").optional(),
      hash: HashString(),
      difficulty: WorkDifficultyString(),
      multiplier: NumberString(),
    }),
    result: z
      .object({
        source: EndpointString(),
        work: WorkString(),
        difficulty: WorkDifficultyString(),
        multiplier: NumberString(),
      })
      .optional(),
    bad_peers: z.union([z.literal(""), EndpointString().array()]),
  });

export type WorkResponse = z.infer<ReturnType<typeof WorkResponse>>;
export const WorkResponse = () =>
  z.object({
    topic: z.literal("work"),
    time: TimestampString(),
    message: WorkMessage(),
  });
