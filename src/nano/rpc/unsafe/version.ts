import { VersionRequest } from "../requests/version";
import { VersionResponse } from "../responses/version";
import { postFunction } from "./post";

export const version = postFunction(VersionRequest(), VersionResponse());
