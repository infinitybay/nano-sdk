import { z } from "zod";

export function AvailableSupplyRequest() {
  return z.object({
    action: z.literal("available_supply"),
  });
}

export type AvailableSupplyRequest = z.infer<ReturnType<typeof AvailableSupplyRequest>>;
