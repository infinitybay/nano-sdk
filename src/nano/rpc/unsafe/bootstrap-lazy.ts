import { BootstrapLazyRequest } from "../requests/bootstrap-lazy";
import { BootstrapLazyResponse } from "../responses/bootstrap-lazy";
import { postFunction } from "./post";

export const bootstrap_lazy = postFunction(BootstrapLazyRequest(), BootstrapLazyResponse());
