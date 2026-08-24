import { z } from "zod";

import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";

const BootstrapPriorities = () =>
  z
    .object({
      account: AccountString(),
      priority: NumberString(),
    })
    .array();

const BootstrapBlocking = () =>
  z
    .object({
      account: AccountString(),
      dependency: HashString(),
      dependency_account: AccountString(),
    })
    .array();

const BootstrapPrioritiesBlocking = () =>
  z.object({
    priorities: BootstrapPriorities().or(z.literal("")),
    blocking: BootstrapBlocking().or(z.literal("")),
  });

export type BootstrapPrioritiesResponse = {
  bootstrap: z.infer<ReturnType<typeof BootstrapPrioritiesBlocking>>;
};

export function BootstrapPrioritiesResponse(): z.ZodType<BootstrapPrioritiesResponse> {
  return z.object({ bootstrap: BootstrapPrioritiesBlocking() });
}
