import { ConfirmationActiveRequest } from "../requests/confirmation-active";
import { ConfirmationActiveResponse } from "../responses/confirmation-active";
import { postFunction } from "./post";

export const confirmation_active = postFunction(ConfirmationActiveRequest(), ConfirmationActiveResponse());
