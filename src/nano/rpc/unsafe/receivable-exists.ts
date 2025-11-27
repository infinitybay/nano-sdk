import { ReceivableExistsRequest } from "../requests/receivable-exists";
import { ReceivableExistsResponse } from "../responses/receivable-exists";
import { postFunction } from "./post";

export const receivable_exists = postFunction(ReceivableExistsRequest(), ReceivableExistsResponse());
