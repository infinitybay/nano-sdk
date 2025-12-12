import { postFunction } from "../http/post";
import { BootstrapLazyRequest } from "../requests/bootstrap-lazy";
import { BootstrapLazyResponse } from "../responses/bootstrap-lazy";

export const bootstrap_lazy = postFunction(BootstrapLazyRequest(), BootstrapLazyResponse());
