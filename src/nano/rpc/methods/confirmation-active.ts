import { postFunction } from "../http/post";
import { ConfirmationActiveRequest } from "../requests/confirmation-active";
import { ConfirmationActiveResponse } from "../responses/confirmation-active";

export const confirmation_active = postFunction(ConfirmationActiveRequest(), ConfirmationActiveResponse());
