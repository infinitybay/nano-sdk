import { z } from "zod";

import { BooleanString } from "../../types/boolean";
import { RootString } from "../../types/root";

export function ConfirmationInfoRequest() {
  return z.object({
    action: z.literal("confirmation_info"),
    root: RootString(),
    contents: BooleanString().or(z.boolean()).optional(),
    json_block: BooleanString().or(z.boolean()).optional(),
    representatives: BooleanString().or(z.boolean()).optional(),
  });
}

export type ConfirmationInfoRequest = z.infer<ReturnType<typeof ConfirmationInfoRequest>>;
