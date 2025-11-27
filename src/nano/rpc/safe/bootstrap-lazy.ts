import { BootstrapLazyRequest } from "../requests/bootstrap-lazy";
import { BootstrapLazyResponse } from "../responses/bootstrap-lazy";
import { safePostFunction } from "./post";

export const bootstrap_lazy = safePostFunction(BootstrapLazyRequest(), BootstrapLazyResponse());
