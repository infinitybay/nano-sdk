import { DatabaseTxnTrackerRequest } from "../requests/database-txn-tracker";
import { DatabaseTxnTrackerResponse } from "../responses/database-txn-tracker";
import { postFunction } from "./post";

export const database_txn_tracker = postFunction(DatabaseTxnTrackerRequest(), DatabaseTxnTrackerResponse());
