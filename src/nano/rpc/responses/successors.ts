import { z } from "zod";

import { HashString } from "../../types/hash";

export function SuccessorsResponse() {
  return z.object({
    blocks: HashString().array().or(z.literal("")),
  });
}

export type SuccessorsResponse = z.infer<ReturnType<typeof SuccessorsResponse>>;
