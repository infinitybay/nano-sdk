import { ConfirmationHistoryRequest } from "../requests/confirmation-history";
import { ConfirmationHistoryResponse } from "../responses/confirmation-history";
import { safePostFunction } from "./post";

export const confirmation_history = safePostFunction(ConfirmationHistoryRequest(), ConfirmationHistoryResponse());
