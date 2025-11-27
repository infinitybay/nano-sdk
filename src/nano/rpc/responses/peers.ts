import "../../../zod-extensions";

import { z } from "zod";

import { BooleanDistribution } from "../../types/boolean-distribution";
import { NodeIdString } from "../../types/node-id";
import { UIntString } from "../../types/uint";
import { UppercaseKeys } from "../../types/uppercase-keys";

const PeerDetails = () =>
  z.object({
    protocol_version: UIntString().transformToUInt(),
    node_id: NodeIdString().or(z.literal("")),
    type: z.string(),
    peering: z.string(),
  });

type PeersResponseOptions = {
  peer_details: boolean;
};

type PeersResponseZodType<T extends UppercaseKeys<PeersResponseOptions>> = z.ZodObject<{
  peers: z.ZodUnion<
    [
      BooleanDistribution<
        T["PEER_DETAILS"],
        z.ZodRecord<z.ZodString, ReturnType<typeof PeerDetails>>,
        z.ZodRecord<z.ZodString, ReturnType<typeof UIntString>>
      >,
      z.ZodLiteral<"">,
    ]
  >;
}>;

export type PeersResponse<T extends UppercaseKeys<PeersResponseOptions>> = z.infer<PeersResponseZodType<T>>;

export function PeersResponse<T extends PeersResponseOptions>(options: T): PeersResponseZodType<UppercaseKeys<T>>;
export function PeersResponse(options: PeersResponseOptions) {
  return options.peer_details
    ? z.object({
        peers: z.record(z.string(), PeerDetails()).or(z.literal("")),
      })
    : z.object({
        peers: z.record(z.string(), UIntString()).or(z.literal("")),
      });
}
