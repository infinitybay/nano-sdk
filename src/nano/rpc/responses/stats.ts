import { z } from "zod";

import { TimestampString } from "../../types/timestamp";
import { UInt64String } from "../../types/uint";
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
    branch_pages: UInt64String(),
    depth: UInt64String(),
    entries: UInt64String(),
    leaf_pages: UInt64String(),
    overflow_pages: UInt64String(),
    page_size: UInt64String(),
  });

const StatsDatabaseRocksDBLevels = () =>
  z.object({
    l0_num_files: UInt64String(),
    l1_num_files: UInt64String(),
    l2_num_files: UInt64String(),
    l3_num_files: UInt64String(),
    l4_num_files: UInt64String(),
    l5_num_files: UInt64String(),
    l6_num_files: UInt64String(),
  });

const StatsDatabaseRocksDBColumnFamily = () =>
  z.object({
    estimate_num_keys: UInt64String(),
    memtable_size: UInt64String(),
    num_deletes_active_mem_table: UInt64String(),
    num_deletes_imm_mem_tables: UInt64String(),
    num_entries_active_mem_table: UInt64String(),
    num_entries_imm_mem_tables: UInt64String(),
    num_immutable_mem_table: UInt64String(),
  });

const StatsDatabaseRocksDB = () =>
  z.object({
    actual_delayed_write_rate: UInt64String(),
    background_errors: UInt64String(),
    base_level: UInt64String(),
    block_cache_capacity: UInt64String(),
    block_cache_pinned_usage: UInt64String(),
    block_cache_usage: UInt64String(),
    column_families: z.record(z.string(), StatsDatabaseRocksDBColumnFamily()),
    compaction_pending: UInt64String(),
    cur_size_all_mem_tables: UInt64String(),
    estimate_live_data_size: UInt64String(),
    estimate_num_keys: UInt64String(),
    estimate_pending_compaction_bytes: UInt64String(),
    estimate_table_readers_mem: UInt64String(),
    is_file_deletions_enabled: UInt64String(),
    is_write_stopped: UInt64String(),
    levels: StatsDatabaseRocksDBLevels(),
    live_sst_files_size: UInt64String(),
    mem_table_flush_pending: UInt64String(),
    min_log_number_to_keep: UInt64String(),
    min_obsolete_sst_number_to_keep: UInt64String(),
    num_deletes_active_mem_table: UInt64String(),
    num_deletes_imm_mem_tables: UInt64String(),
    num_entries_active_mem_table: UInt64String(),
    num_entries_imm_mem_tables: UInt64String(),
    num_immutable_mem_table: UInt64String(),
    num_immutable_mem_table_flushed: UInt64String(),
    num_live_versions: UInt64String(),
    num_running_compactions: UInt64String(),
    num_running_flushes: UInt64String(),
    num_snapshots: UInt64String(),
    oldest_snapshot_time: UInt64String(),
    size_all_mem_tables: UInt64String(),
    total_sst_files_size: UInt64String(),
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
