import { z } from "zod";

import { StateBlock } from "../../blocks/state-block";
import { BooleanString } from "../../types/boolean";

const ProcessSubtypeString = () => z.enum(["change", "epoch", "open", "receive", "send"]);

export function ProcessRequest() {
  return z.union([
    z.object({
      action: z.literal("process"),
      json_block: z.literal(true),
      subtype: ProcessSubtypeString().optional(),
      block: StateBlock(),
      force: BooleanString().or(z.boolean()).optional(),
      async: BooleanString().or(z.boolean()).optional(),
    }),
    z.object({
      action: z.literal("process"),
      json_block: z.literal(false),
      subtype: ProcessSubtypeString().optional(),
      block: z.string(),
      force: BooleanString().or(z.boolean()).optional(),
      async: BooleanString().or(z.boolean()).optional(),
    }),
  ]);
}

export type ProcessRequest = z.infer<ReturnType<typeof ProcessRequest>>;
