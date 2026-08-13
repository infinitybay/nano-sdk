import { DatabaseTxnTrackerRequest } from "../../../../../src/nano/rpc/requests/database-txn-tracker";
import { assert } from "../../../../assert";

describe("DatabaseTxnTrackerRequest schema", () => {
  test("validates database transaction tracker request", () => {
    const result = DatabaseTxnTrackerRequest().safeParse({
      action: "database_txn_tracker",
      min_read_time: 0,
      min_write_time: 1,
    });
    assert(result.success);
  });

  test("rejects database transaction tracker request with negative timings", () => {
    const result = DatabaseTxnTrackerRequest().safeParse({
      action: "database_txn_tracker",
      min_read_time: -1,
      min_write_time: 1,
    });
    assert(!result.success);
  });
});
