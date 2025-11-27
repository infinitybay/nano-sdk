import { BootstrapPrioritiesRequest } from "../requests/bootstrap-priorities";
import { BootstrapPrioritiesResponse } from "../responses/bootstrap-priorities";
import { safePostFunction } from "./post";

export const bootstrap_priorities = safePostFunction(BootstrapPrioritiesRequest(), BootstrapPrioritiesResponse());
