import { z } from "zod";

import { AccountString } from "../../types/account";
import { RawAmountString } from "../../types/amount";
import { BooleanDistribution } from "../../types/boolean-distribution";
import { NumberString } from "../../types/number";
import { UppercaseKeys } from "../../types/uppercase-keys";

type ConfirmationQuorum = z.infer<ReturnType<typeof ConfirmationQuorum>>;
const ConfirmationQuorum = () =>
  z.object({
    quorum_delta: RawAmountString(),
    online_weight_quorum_percent: NumberString(),
    online_weight_minimum: RawAmountString(),
    online_stake_total: RawAmountString(),
    peers_stake_total: RawAmountString(),
    trended_stake_total: RawAmountString(),
  });

type ConfirmationQuorumPeer = z.infer<ReturnType<typeof ConfirmationQuorumPeer>>;
const ConfirmationQuorumPeer = () =>
  z.object({
    account: AccountString(),
    ip: z.string(),
    weight: RawAmountString(),
  });

type ConfirmationQuorumResponseOptions = {
  peer_details: boolean;
};

type ConfirmationQuorumResponseZodType<T extends UppercaseKeys<ConfirmationQuorumResponseOptions>> =
  BooleanDistribution<
    T["PEER_DETAILS"],
    z.ZodObject<
      ReturnType<typeof ConfirmationQuorum>["shape"] & {
        peers: z.ZodArray<ReturnType<typeof ConfirmationQuorumPeer>>;
      }
    >,
    ReturnType<typeof ConfirmationQuorum>
  >;

export type ConfirmationQuorumResponse<T extends UppercaseKeys<ConfirmationQuorumResponseOptions>> = z.infer<
  ConfirmationQuorumResponseZodType<T>
>;

export function ConfirmationQuorumResponse<T extends ConfirmationQuorumResponseOptions>(
  options: T
): ConfirmationQuorumResponseZodType<UppercaseKeys<T>>;
export function ConfirmationQuorumResponse(options: ConfirmationQuorumResponseOptions) {
  return options.peer_details
    ? ConfirmationQuorum().extend({ peers: ConfirmationQuorumPeer().array() })
    : ConfirmationQuorum();
}
