import { BootstrapRequest } from "../requests/bootstrap";
import { BootstrapResponse } from "../responses/bootstrap";
import { postFunction } from "./post";

export const bootstrap = postFunction(BootstrapRequest(), BootstrapResponse());
