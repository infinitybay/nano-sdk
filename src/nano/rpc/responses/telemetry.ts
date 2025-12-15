import z from "zod";

import { BooleanDistribution } from "../../types/boolean-distribution";
import { EndpointString } from "../../types/endpoint";
import { HashString } from "../../types/hash";
import { NodeIdString } from "../../types/node-id";
import { PortString } from "../../types/port";
import { SignatureString } from "../../types/signature";
import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";
import { UppercaseKeys } from "../../types/uppercase-keys";
import { WorkDifficultyString } from "../../types/work-difficulty";

const TelemetryError = () =>
  z.object({
    error: z.string(),
  });

export type TelemetryMetrics = z.infer<ReturnType<typeof TelemetryMetrics>>;
export const TelemetryMetrics = () =>
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
  });

export type TelemetryMetricsRaw = z.infer<ReturnType<typeof TelemetryMetricsRaw>>;
export const TelemetryMetricsRaw = () =>
  TelemetryMetrics().extend({
    address: EndpointString(),
    port: PortString(),
  });

type TelemetryResponseOptions = {
  address: boolean;
  port: boolean;
  raw: boolean;
};

type TelemetryResponseZodType<T extends UppercaseKeys<TelemetryResponseOptions>> = BooleanDistribution<
  T["ADDRESS"],
  BooleanDistribution<T["PORT"], ReturnType<typeof TelemetryMetrics>, ReturnType<typeof TelemetryError>>,
  BooleanDistribution<
    T["PORT"],
    ReturnType<typeof TelemetryError>,
    BooleanDistribution<
      T["RAW"],
      z.ZodObject<{ metrics: z.ZodUnion<[z.ZodArray<ReturnType<typeof TelemetryMetricsRaw>>, z.ZodLiteral<"">]> }>,
      ReturnType<typeof TelemetryMetrics>
    >
  >
>;

export type TelemetryResponse<T extends UppercaseKeys<TelemetryResponseOptions>> = z.infer<TelemetryResponseZodType<T>>;

export function TelemetryResponse<T extends TelemetryResponseOptions>(
  options: T
): TelemetryResponseZodType<UppercaseKeys<T>>;
export function TelemetryResponse(options: TelemetryResponseOptions) {
  if (options.address != options.port) return TelemetryError();
  if (options.address && options.port) return TelemetryMetrics();
  return options.raw
    ? z.object({ metrics: z.union([TelemetryMetricsRaw().array(), z.literal("")]) })
    : TelemetryMetrics();
}
