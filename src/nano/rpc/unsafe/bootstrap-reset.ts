import { BootstrapResetRequest } from "../requests/bootstrap-reset";
import { BootstrapResetResponse } from "../responses/bootstrap-reset";
import { postFunction } from "./post";

export const bootstrap_reset = postFunction(BootstrapResetRequest(), BootstrapResetResponse());
