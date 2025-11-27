import "../../../zod-extensions";

import { z } from "zod";

import { AccountString } from "../../types/account";
import { HashString } from "../../types/hash";
import { NumberString } from "../../types/number";

const BootstrapPriorities = () =>
  z
    .object({
      account: AccountString(),
      priority: NumberString().transformToNumber(),
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

export function BootstrapPrioritiesResponse() {
  return z.object({
    priorities: BootstrapPriorities().or(z.literal("")),
    blocking: BootstrapBlocking().or(z.literal("")),
  });
}

export type BootstrapPrioritiesResponse = z.infer<ReturnType<typeof BootstrapPrioritiesResponse>>;
