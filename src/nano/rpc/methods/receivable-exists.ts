import { postFunction } from "../http/post";
import { ReceivableExistsRequest } from "../requests/receivable-exists";
import { ReceivableExistsResponse } from "../responses/receivable-exists";

export const receivable_exists = postFunction(ReceivableExistsRequest(), ReceivableExistsResponse());
