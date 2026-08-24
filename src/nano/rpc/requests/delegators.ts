import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { UInt, UIntString } from "../../types/uint";

const DelegatorsStartString = () =>
  z.string().superRefine((value, ctx) => {
    if (AccountString().safeParse(value).success) {
      return;
    }

    const separator = value.indexOf(":");
    if (separator === -1 || separator !== value.lastIndexOf(":")) {
      ctx.addIssue({ code: "custom", message: "Invalid delegator cursor format" });
      return;
    }

    const weight = value.substring(0, separator);
    const account = value.substring(separator + 1);
    if (weight.length === 0 && account.length === 0) {
      ctx.addIssue({ code: "custom", message: "Delegator cursor must include a weight or account" });
      return;
    }

    if (weight.length > 0 && !RawAmountString().safeParse(weight).success) {
      ctx.addIssue({ code: "custom", message: "Invalid delegator cursor weight" });
    }
    if (account.length > 0 && !AccountString().safeParse(account).success) {
      ctx.addIssue({ code: "custom", message: "Invalid delegator cursor account" });
    }
  });

export function DelegatorsRequest() {
  return z.object({
    action: z.literal("delegators"),
    account: AccountString(),
    threshold: RawAmountString().optional(),
    start: DelegatorsStartString().optional(),
    count: UIntString().or(UInt()).optional(),
  });
}

export type DelegatorsRequest = z.infer<ReturnType<typeof DelegatorsRequest>>;
