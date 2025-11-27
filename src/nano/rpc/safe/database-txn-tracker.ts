import { DatabaseTxnTrackerRequest } from "../requests/database-txn-tracker";
import { DatabaseTxnTrackerResponse } from "../responses/database-txn-tracker";
import { safePostFunction } from "./post";

export const database_txn_tracker = safePostFunction(DatabaseTxnTrackerRequest(), DatabaseTxnTrackerResponse());
