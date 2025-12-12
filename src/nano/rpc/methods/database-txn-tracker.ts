import { postFunction } from "../http/post";
import { DatabaseTxnTrackerRequest } from "../requests/database-txn-tracker";
import { DatabaseTxnTrackerResponse } from "../responses/database-txn-tracker";

export const database_txn_tracker = postFunction(DatabaseTxnTrackerRequest(), DatabaseTxnTrackerResponse());
