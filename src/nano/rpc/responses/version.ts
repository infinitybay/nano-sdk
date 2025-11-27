import "../../../zod-extensions";

import z from "zod";

import { HashString } from "../../types/hash";
import { UIntString } from "../../types/uint";

export function VersionResponse() {
  return z.object({
    rpc_version: UIntString().transformToUInt(),
    store_version: UIntString().transformToUInt(),
    protocol_version: UIntString().transformToUInt(),
    node_vendor: z.string(),
    store_vendor: z.string(),
    network: z.union([z.literal("live"), z.literal("beta"), z.literal("dev"), z.literal("test")]),
    network_identifier: HashString(),
    build_info: z.string(),
  });
}

export type VersionResponse = z.infer<ReturnType<typeof VersionResponse>>;
