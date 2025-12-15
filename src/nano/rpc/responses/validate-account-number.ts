import { z } from "zod";

import { BinaryBooleanString } from "../../types/binary-boolean-string";

export function ValidateAccountNumberResponse() {
  return z.object({
    valid: BinaryBooleanString(),
  });
}

export type ValidateAccountNumberResponse = z.infer<ReturnType<typeof ValidateAccountNumberResponse>>;
