import { BootstrapResetRequest } from "../requests/bootstrap-reset";
import { BootstrapResetResponse } from "../responses/bootstrap-reset";
import { safePostFunction } from "./post";

export const bootstrap_reset = safePostFunction(BootstrapResetRequest(), BootstrapResetResponse());
