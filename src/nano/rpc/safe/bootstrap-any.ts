import { BootstrapAnyRequest } from "../requests/bootstrap-any";
import { BootstrapAnyResponse } from "../responses/bootstrap-any";
import { safePostFunction } from "./post";

export const bootstrap_any = safePostFunction(BootstrapAnyRequest(), BootstrapAnyResponse());
