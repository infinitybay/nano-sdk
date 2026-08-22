import { z } from "zod";

import { RAW_MAX, RAW_SCALE } from "../../types/amount";
import { UInt } from "../../types/uint";

const POSITIVE_INTEGER_REGEX = /^[1-9][0-9]*$/;
const MAX_NANO_TO_RAW_AMOUNT = RAW_MAX / RAW_SCALE;

function NanoToRawAmountString() {
  return z.string().refine(
    (amount) => {
      try {
        return POSITIVE_INTEGER_REGEX.test(amount) && BigInt(amount) <= MAX_NANO_TO_RAW_AMOUNT;
      } catch (_err) {
        return false;
      }
    },
    { message: "Invalid nano to raw amount!" }
  );
}

export function NanoToRawRequest() {
  return z.object({
    action: z.literal("nano_to_raw"),
    amount: z.union([NanoToRawAmountString(), UInt().min(1).max(Number(MAX_NANO_TO_RAW_AMOUNT))]),
  });
}

export type NanoToRawRequest = z.infer<ReturnType<typeof NanoToRawRequest>>;
