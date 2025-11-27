import { VersionRequest } from "../requests/version";
import { VersionResponse } from "../responses/version";
import { safePostFunction } from "./post";

export const version = safePostFunction(VersionRequest(), VersionResponse());
