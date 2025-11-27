import { z } from "zod";

export function ValidateAccountNumberResponse() {
  return z.object({
    valid: z.literal("1").or(z.literal("0")),
  });
}

export type ValidateAccountNumberResponse = z.infer<ReturnType<typeof ValidateAccountNumberResponse>>;
