import { BootstrapAnyRequest } from "../requests/bootstrap-any";
import { BootstrapAnyResponse } from "../responses/bootstrap-any";
import { postFunction } from "./post";

export const bootstrap_any = postFunction(BootstrapAnyRequest(), BootstrapAnyResponse());
