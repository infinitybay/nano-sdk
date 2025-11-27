import { BootstrapStatusRequest } from "../requests/bootstrap-status";
import { BootstrapStatusResponse } from "../responses/bootstrap-status";
import { postFunction } from "./post";

export const bootstrap_status = postFunction(BootstrapStatusRequest(), BootstrapStatusResponse());
