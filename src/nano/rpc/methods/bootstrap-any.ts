import { postFunction } from "../http/post";
import { BootstrapAnyRequest } from "../requests/bootstrap-any";
import { BootstrapAnyResponse } from "../responses/bootstrap-any";

export const bootstrap_any = postFunction(BootstrapAnyRequest(), BootstrapAnyResponse());
