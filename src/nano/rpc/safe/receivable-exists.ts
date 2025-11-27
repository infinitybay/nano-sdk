import { ReceivableExistsRequest } from "../requests/receivable-exists";
import { ReceivableExistsResponse } from "../responses/receivable-exists";
import { safePostFunction } from "./post";

export const receivable_exists = safePostFunction(ReceivableExistsRequest(), ReceivableExistsResponse());
