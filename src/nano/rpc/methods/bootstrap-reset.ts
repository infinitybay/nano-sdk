import { postFunction } from "../http/post";
import { BootstrapResetRequest } from "../requests/bootstrap-reset";
import { BootstrapResetResponse } from "../responses/bootstrap-reset";

export const bootstrap_reset = postFunction(BootstrapResetRequest(), BootstrapResetResponse());
