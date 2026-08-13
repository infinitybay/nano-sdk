import { DatabaseTxnTrackerResponse } from "../../../../../src/nano/rpc/responses/database-txn-tracker";
import { assert } from "../../../../assert";

describe("DatabaseTxnTrackerResponse schema", () => {
  test("parses database transaction tracker response", () => {
    const result = DatabaseTxnTrackerResponse().safeParse({
      txn_tracking: [
        {
          thread: "1",
          time_held_open: "1",
          write: "false",
          stacktrace: [
            {
              name: "abc",
              address: "1",
              source_file: "abc",
              source_line: "1",
            },
          ],
        },
      ],
    });
    assert(result.success);
  });
});
