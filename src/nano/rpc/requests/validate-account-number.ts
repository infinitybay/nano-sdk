import { z } from "zod";

export function ValidateAccountNumberRequest() {
  return z.object({
    action: z.literal("validate_account_number"),
    account: z.string(), // No AccountString; use Nano node validation instead
  });
}

export type ValidateAccountNumberRequest = z.infer<ReturnType<typeof ValidateAccountNumberRequest>>;
