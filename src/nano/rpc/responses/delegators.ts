import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";

const DelegatorsNextString = () =>
  z.string().superRefine((value, ctx) => {
    const separator = value.indexOf(":");
    if (separator <= 0 || separator !== value.lastIndexOf(":")) {
      ctx.addIssue({ code: "custom", message: "Invalid delegator cursor format" });
      return;
    }

    const weight = value.substring(0, separator);
    const account = value.substring(separator + 1);
    if (!RawAmountString().safeParse(weight).success) {
      ctx.addIssue({ code: "custom", message: "Invalid delegator cursor weight" });
    }
    if (!AccountString().safeParse(account).success) {
      ctx.addIssue({ code: "custom", message: "Invalid delegator cursor account" });
    }
  });

export function DelegatorsResponse() {
  return z.object({
    delegators: z.record(AccountString(), RawAmountString()).or(z.literal("")),
    next: DelegatorsNextString().optional(),
  });
}

export type DelegatorsResponse = z.infer<ReturnType<typeof DelegatorsResponse>>;
