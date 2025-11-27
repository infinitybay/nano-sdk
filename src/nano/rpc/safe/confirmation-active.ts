import { ConfirmationActiveRequest } from "../requests/confirmation-active";
import { ConfirmationActiveResponse } from "../responses/confirmation-active";
import { safePostFunction } from "./post";

export const confirmation_active = safePostFunction(ConfirmationActiveRequest(), ConfirmationActiveResponse());
