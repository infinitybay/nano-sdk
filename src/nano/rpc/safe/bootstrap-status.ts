import { BootstrapStatusRequest } from "../requests/bootstrap-status";
import { BootstrapStatusResponse } from "../responses/bootstrap-status";
import { safePostFunction } from "./post";

export const bootstrap_status = safePostFunction(BootstrapStatusRequest(), BootstrapStatusResponse());
