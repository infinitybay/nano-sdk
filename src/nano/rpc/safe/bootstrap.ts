import { BootstrapRequest } from "../requests/bootstrap";
import { BootstrapResponse } from "../responses/bootstrap";
import { safePostFunction } from "./post";

export const bootstrap = safePostFunction(BootstrapRequest(), BootstrapResponse());
