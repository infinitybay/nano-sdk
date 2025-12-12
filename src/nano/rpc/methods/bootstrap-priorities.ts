import { postFunction } from "../http/post";
import { BootstrapPrioritiesRequest } from "../requests/bootstrap-priorities";
import { BootstrapPrioritiesResponse } from "../responses/bootstrap-priorities";

export const bootstrap_priorities = postFunction(BootstrapPrioritiesRequest(), BootstrapPrioritiesResponse());
