import { BootstrapPrioritiesRequest } from "../requests/bootstrap-priorities";
import { BootstrapPrioritiesResponse } from "../responses/bootstrap-priorities";
import { postFunction } from "./post";

export const bootstrap_priorities = postFunction(BootstrapPrioritiesRequest(), BootstrapPrioritiesResponse());
