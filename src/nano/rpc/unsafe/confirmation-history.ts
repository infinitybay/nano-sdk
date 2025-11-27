import { ConfirmationHistoryRequest } from "../requests/confirmation-history";
import { ConfirmationHistoryResponse } from "../responses/confirmation-history";
import { postFunction } from "./post";

export const confirmation_history = postFunction(ConfirmationHistoryRequest(), ConfirmationHistoryResponse());
