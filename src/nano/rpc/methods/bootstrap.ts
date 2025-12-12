import { postFunction } from "../http/post";
import { BootstrapRequest } from "../requests/bootstrap";
import { BootstrapResponse } from "../responses/bootstrap";

export const bootstrap = postFunction(BootstrapRequest(), BootstrapResponse());
