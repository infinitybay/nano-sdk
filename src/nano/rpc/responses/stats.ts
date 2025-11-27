import "../../../zod-extensions";

import { z } from "zod";

import { TimestampString } from "../../types/timestamp";
import { UIntString } from "../../types/uint";
import { UppercaseKeys } from "../../types/uppercase-keys";

export type StatsCountersEntry = z.infer<ReturnType<typeof StatsCountersEntry>>;
export const StatsCountersEntry = () =>
  z.object({
    time: z.string(),
    type: z.string(),
    detail: z.string(),
    dir: z.string(),
    value: z.string(),
  });

export type StatsCounters = z.infer<ReturnType<typeof StatsCounters>>;
export const StatsCounters = () =>
  z.object({
    type: z.literal("counters"),
    created: z.string(),
    entries: StatsCountersEntry().array(),
    stat_duration_seconds: TimestampString(),
  });

export type StatsSamplesEntry = z.infer<ReturnType<typeof StatsSamplesEntry>>;
export const StatsSamplesEntry = () =>
  z.object({
    time: z.string(),
    sample: z.string(),
    min: z.string(),
    max: z.string(),
    values: z.string().array(),
  });

export type StatsSamples = z.infer<ReturnType<typeof StatsSamples>>;
export const StatsSamples = () =>
  z.object({
    type: z.literal("samples"),
    created: z.string(),
    entries: StatsSamplesEntry().array(),
    stat_duration_seconds: z.string(),
  });

export type StatsObjects = z.infer<ReturnType<typeof StatsObjects>>;
export const StatsObjects = () =>
  z.object({
    node: z.unknown(),
  });

export type StatsDatabase = z.infer<ReturnType<typeof StatsDatabase>>;
export const StatsDatabase = () =>
  z.object({
    branch_pages: UIntString().transformToUInt(),
    depth: UIntString().transformToUInt(),
    entries: UIntString().transformToUInt(),
    leaf_pages: UIntString().transformToUInt(),
    overflow_pages: UIntString().transformToUInt(),
    page_size: UIntString().transformToUInt(),
  });

type StatsType = "counters" | "samples" | "objects" | "database";
type StatsResponseOptions = {
  type: StatsType;
};

type StatsResponseMap = {
  counters: ReturnType<typeof StatsCounters>;
  samples: ReturnType<typeof StatsSamples>;
  objects: ReturnType<typeof StatsObjects>;
  database: ReturnType<typeof StatsDatabase>;
};

type StatsResponseZodType<T extends UppercaseKeys<StatsResponseOptions>> = StatsResponseMap[T["TYPE"]];

export type StatsResponse<T extends UppercaseKeys<StatsResponseOptions>> = z.infer<StatsResponseZodType<T>>;

export function StatsResponse<T extends StatsResponseOptions>(options: T): StatsResponseZodType<UppercaseKeys<T>>;
export function StatsResponse(options: StatsResponseOptions) {
  if (options.type === "counters") return StatsCounters();
  if (options.type === "samples") return StatsSamples();
  if (options.type === "objects") return StatsObjects();
  if (options.type === "database") return StatsDatabase();
  return z.object({ error: z.string() });
}
