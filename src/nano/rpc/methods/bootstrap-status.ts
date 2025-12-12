import { postFunction } from "../http/post";
import { BootstrapStatusRequest } from "../requests/bootstrap-status";
import { BootstrapStatusResponse } from "../responses/bootstrap-status";

export const bootstrap_status = postFunction(BootstrapStatusRequest(), BootstrapStatusResponse());
