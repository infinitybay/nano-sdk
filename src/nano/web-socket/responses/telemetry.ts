import { z } from "zod";

import { EndpointString } from "../../types/endpoint";
import { HashString } from "../../types/hash";
import { NodeIdString } from "../../types/node-id";
import { PortString } from "../../types/port";
import { SignatureString } from "../../types/signature";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";
import { WorkDifficultyString } from "../../types/work-difficulty";

const TelemetryMessageBase = () =>
  z.object({
    block_count: UIntString(),
    cemented_count: UIntString(),
    unchecked_count: UIntString(),
    account_count: UIntString(),
    bandwidth_cap: UIntString(),
    peer_count: UIntString(),
    protocol_version: UIntString(),
    uptime: TimestampString(),
    genesis_block: HashString(),
    major_version: UIntString(),
    minor_version: UIntString(),
    patch_version: UIntString(),
    pre_release_version: UIntString(),
    maker: z.enum(["nf_node", "nf_pruned_node", "nf_peering_node", "rs_nano", "invalid"]),
    timestamp: TimestampString(),
    active_difficulty: WorkDifficultyString(),
    node_id: NodeIdString(),
    signature: SignatureString(),
    address: EndpointString(),
    port: PortString(),
  });

const TelemetryMessageV1 = () =>
  TelemetryMessageBase().extend({
    database_backend: z.never().optional(),
    confirmation_latency_ms_p50: z.never().optional(),
    confirmation_latency_ms_p90: z.never().optional(),
    confirmation_latency_ms_p99: z.never().optional(),
    bootstrap_status: z.never().optional(),
  });

const TelemetryMessageV2 = () =>
  TelemetryMessageBase().extend({
    database_backend: z.enum(["unknown", "lmdb", "rocksdb", "invalid"]),
    confirmation_latency_ms_p50: UIntString(),
    confirmation_latency_ms_p90: UIntString(),
    confirmation_latency_ms_p99: UIntString(),
    bootstrap_status: z.enum(["unknown", "syncing", "synced", "invalid"]),
  });

export type TelemetryMessage = z.infer<ReturnType<typeof TelemetryMessage>>;
export const TelemetryMessage = () => z.union([TelemetryMessageV2(), TelemetryMessageV1()]);

export type TelemetryResponse = z.infer<ReturnType<typeof TelemetryResponse>>;
export const TelemetryResponse = () =>
  z.object({
    topic: z.literal("telemetry"),
    time: TimestampString(),
    message: TelemetryMessage(),
  });
