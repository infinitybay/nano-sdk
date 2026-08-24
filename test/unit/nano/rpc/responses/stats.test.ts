import { StatsResponse } from "../../../../../src/nano/rpc/responses/stats";
import { assert } from "../../../../assert";

describe("StatsResponse schema", () => {
  test("parses counters stats response", () => {
    const schema = StatsResponse({ type: "counters" });
    const result = schema.safeParse({
      type: "counters",
      created: "0",
      entries: [{ time: "0", type: "t", detail: "d", dir: "in", value: "1" }],
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses counters stats response with empty entries", () => {
    const schema = StatsResponse({ type: "counters" });
    const result = schema.safeParse({
      type: "counters",
      created: "0",
      entries: "",
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses samples stats response", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: [{ time: "0", sample: "s", min: "1", max: "2", values: ["1", "2"] }],
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses samples stats response with empty entries", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: "",
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("parses samples stats response with empty sample values", () => {
    const schema = StatsResponse({ type: "samples" });
    const result = schema.safeParse({
      type: "samples",
      created: "0",
      entries: [{ time: "0", sample: "s", min: "0", max: "0", values: "" }],
      stat_duration_seconds: "5",
    });
    assert(result.success);
  });

  test("rejects non-empty strings for collection fields", () => {
    const countersSchema = StatsResponse({ type: "counters" });
    const samplesSchema = StatsResponse({ type: "samples" });

    expect(
      countersSchema.safeParse({
        type: "counters",
        created: "0",
        entries: "invalid",
        stat_duration_seconds: "5",
      }).success
    ).toBe(false);
    expect(
      samplesSchema.safeParse({
        type: "samples",
        created: "0",
        entries: [{ time: "0", sample: "s", min: "0", max: "0", values: "invalid" }],
        stat_duration_seconds: "5",
      }).success
    ).toBe(false);
  });

  test("parses objects stats response", () => {
    const schema = StatsResponse({ type: "objects" });
    const result = schema.safeParse({
      node: {},
    });
    assert(result.success);
  });

  test("parses LMDB database stats response", () => {
    const schema = StatsResponse({ type: "database" });
    const result = schema.safeParse({
      branch_pages: "1",
      depth: "1",
      entries: "1",
      leaf_pages: "1",
      overflow_pages: "1",
      page_size: "1",
    });
    assert(result.success);
  });

  test("parses Nano node V29 RocksDB database stats response", () => {
    const schema = StatsResponse({ type: "database" });
    const result = schema.safeParse({
      actual_delayed_write_rate: "1",
      background_errors: "2",
      base_level: "3",
      block_cache_capacity: "4",
      block_cache_pinned_usage: "5",
      block_cache_usage: "6",
      column_families: {
        accounts: {
          estimate_num_keys: "7",
          memtable_size: "8",
          num_deletes_active_mem_table: "9",
          num_deletes_imm_mem_tables: "10",
          num_entries_active_mem_table: "11",
          num_entries_imm_mem_tables: "12",
          num_immutable_mem_table: "13",
        },
      },
      compaction_pending: "14",
      cur_size_all_mem_tables: "15",
      estimate_live_data_size: "16",
      estimate_num_keys: "17",
      estimate_pending_compaction_bytes: "18",
      estimate_table_readers_mem: "19",
      is_file_deletions_enabled: "1",
      is_write_stopped: "0",
      levels: {
        l0_num_files: "20",
        l1_num_files: "21",
        l2_num_files: "22",
        l3_num_files: "23",
        l4_num_files: "24",
        l5_num_files: "25",
        l6_num_files: "26",
      },
      live_sst_files_size: "27",
      mem_table_flush_pending: "0",
      min_log_number_to_keep: "28",
      min_obsolete_sst_number_to_keep: "29",
      num_deletes_active_mem_table: "30",
      num_deletes_imm_mem_tables: "31",
      num_entries_active_mem_table: "32",
      num_entries_imm_mem_tables: "33",
      num_immutable_mem_table: "34",
      num_immutable_mem_table_flushed: "35",
      num_live_versions: "36",
      num_running_compactions: "37",
      num_running_flushes: "38",
      num_snapshots: "39",
      oldest_snapshot_time: "40",
      size_all_mem_tables: "41",
      total_sst_files_size: "42",
    });
    assert(result.success);
  });

  test("rejects Nano node V28 RocksDB database stats response", () => {
    const schema = StatsResponse({ type: "database" });
    const result = schema.safeParse({
      "block-cache-capacity": "1",
      "block-cache-usage": "1",
      "compaction-pending": "1",
      "cur-size-all-mem-tables": "1",
      "estimate-live-data-size": "1",
      "estimate-num-keys": "1",
      "estimate-pending-compaction-bytes": "1",
      "estimate-table-readers-mem": "1",
      "size-all-mem-tables": "1",
      "total-sst-files-size": "1",
    });

    expect(result.success).toBe(false);
  });

  test("rejects incomplete Nano node V29 RocksDB nested stats", () => {
    const schema = StatsResponse({ type: "database" });
    const result = schema.safeParse({
      actual_delayed_write_rate: "1",
      background_errors: "1",
      base_level: "1",
      block_cache_capacity: "1",
      block_cache_pinned_usage: "1",
      block_cache_usage: "1",
      column_families: {
        accounts: {
          estimate_num_keys: "1",
          memtable_size: "1",
        },
      },
      compaction_pending: "1",
      cur_size_all_mem_tables: "1",
      estimate_live_data_size: "1",
      estimate_num_keys: "1",
      estimate_pending_compaction_bytes: "1",
      estimate_table_readers_mem: "1",
      is_file_deletions_enabled: "1",
      is_write_stopped: "1",
      levels: {
        l0_num_files: "1",
      },
      live_sst_files_size: "1",
      mem_table_flush_pending: "1",
      min_log_number_to_keep: "1",
      min_obsolete_sst_number_to_keep: "1",
      num_deletes_active_mem_table: "1",
      num_deletes_imm_mem_tables: "1",
      num_entries_active_mem_table: "1",
      num_entries_imm_mem_tables: "1",
      num_immutable_mem_table: "1",
      num_immutable_mem_table_flushed: "1",
      num_live_versions: "1",
      num_running_compactions: "1",
      num_running_flushes: "1",
      num_snapshots: "1",
      oldest_snapshot_time: "1",
      size_all_mem_tables: "1",
      total_sst_files_size: "1",
    });

    expect(result.success).toBe(false);
  });
});
