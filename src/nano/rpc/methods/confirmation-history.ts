import { postFunction } from "../http/post";
import { ConfirmationHistoryRequest } from "../requests/confirmation-history";
import { ConfirmationHistoryResponse } from "../responses/confirmation-history";

export const confirmation_history = postFunction(ConfirmationHistoryRequest(), ConfirmationHistoryResponse());
