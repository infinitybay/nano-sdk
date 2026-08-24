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
    entries: z.union([StatsCountersEntry().array(), z.literal("")]),
    stat_duration_seconds: TimestampString(),
  });

export type StatsSamplesEntry = z.infer<ReturnType<typeof StatsSamplesEntry>>;
export const StatsSamplesEntry = () =>
  z.object({
    time: z.string(),
    sample: z.string(),
    min: z.string(),
    max: z.string(),
    values: z.union([z.string().array(), z.literal("")]),
  });

export type StatsSamples = z.infer<ReturnType<typeof StatsSamples>>;
export const StatsSamples = () =>
  z.object({
    type: z.literal("samples"),
    created: z.string(),
    entries: z.union([StatsSamplesEntry().array(), z.literal("")]),
    stat_duration_seconds: z.string(),
  });

export type StatsObjects = z.infer<ReturnType<typeof StatsObjects>>;
export const StatsObjects = () =>
  z.object({
    node: z.unknown(),
  });

const StatsDatabaseLmdb = () =>
  z.object({
    branch_pages: UIntString(),
    depth: UIntString(),
    entries: UIntString(),
    leaf_pages: UIntString(),
    overflow_pages: UIntString(),
    page_size: UIntString(),
  });

const StatsDatabaseRocksDBLevels = () =>
  z.object({
    l0_num_files: UIntString(),
    l1_num_files: UIntString(),
    l2_num_files: UIntString(),
    l3_num_files: UIntString(),
    l4_num_files: UIntString(),
    l5_num_files: UIntString(),
    l6_num_files: UIntString(),
  });

const StatsDatabaseRocksDBColumnFamily = () =>
  z.object({
    estimate_num_keys: UIntString(),
    memtable_size: UIntString(),
    num_deletes_active_mem_table: UIntString(),
    num_deletes_imm_mem_tables: UIntString(),
    num_entries_active_mem_table: UIntString(),
    num_entries_imm_mem_tables: UIntString(),
    num_immutable_mem_table: UIntString(),
  });

const StatsDatabaseRocksDB = () =>
  z.object({
    actual_delayed_write_rate: UIntString(),
    background_errors: UIntString(),
    base_level: UIntString(),
    block_cache_capacity: UIntString(),
    block_cache_pinned_usage: UIntString(),
    block_cache_usage: UIntString(),
    column_families: z.record(z.string(), StatsDatabaseRocksDBColumnFamily()),
    compaction_pending: UIntString(),
    cur_size_all_mem_tables: UIntString(),
    estimate_live_data_size: UIntString(),
    estimate_num_keys: UIntString(),
    estimate_pending_compaction_bytes: UIntString(),
    estimate_table_readers_mem: UIntString(),
    is_file_deletions_enabled: UIntString(),
    is_write_stopped: UIntString(),
    levels: StatsDatabaseRocksDBLevels(),
    live_sst_files_size: UIntString(),
    mem_table_flush_pending: UIntString(),
    min_log_number_to_keep: UIntString(),
    min_obsolete_sst_number_to_keep: UIntString(),
    num_deletes_active_mem_table: UIntString(),
    num_deletes_imm_mem_tables: UIntString(),
    num_entries_active_mem_table: UIntString(),
    num_entries_imm_mem_tables: UIntString(),
    num_immutable_mem_table: UIntString(),
    num_immutable_mem_table_flushed: UIntString(),
    num_live_versions: UIntString(),
    num_running_compactions: UIntString(),
    num_running_flushes: UIntString(),
    num_snapshots: UIntString(),
    oldest_snapshot_time: UIntString(),
    size_all_mem_tables: UIntString(),
    total_sst_files_size: UIntString(),
  });

export type StatsDatabase = z.infer<ReturnType<typeof StatsDatabase>>;
export const StatsDatabase = () => z.union([StatsDatabaseLmdb(), StatsDatabaseRocksDB()]);

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
