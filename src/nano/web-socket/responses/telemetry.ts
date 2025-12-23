import { z } from "zod";

import { EndpointString } from "../../types/endpoint";
import { HashString } from "../../types/hash";
import { NodeIdString } from "../../types/node-id";
import { PortString } from "../../types/port";
import { SignatureString } from "../../types/signature";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";
import { WorkDifficultyString } from "../../types/work-difficulty";

export type TelemetryMessage = z.infer<ReturnType<typeof TelemetryMessage>>;
export const TelemetryMessage = () =>
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
    maker: UIntString(),
    timestamp: TimestampString(),
    active_difficulty: WorkDifficultyString(),
    node_id: NodeIdString(),
    signature: SignatureString(),
    address: EndpointString(),
    port: PortString(),
  });

export type TelemetryResponse = z.infer<ReturnType<typeof TelemetryResponse>>;
export const TelemetryResponse = () =>
  z.object({
    topic: z.literal("telemetry"),
    time: TimestampString(),
    message: TelemetryMessage(),
  });
