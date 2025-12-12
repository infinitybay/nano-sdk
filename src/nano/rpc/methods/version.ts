import { postFunction } from "../http/post";
import { VersionRequest } from "../requests/version";
import { VersionResponse } from "../responses/version";

export const version = postFunction(VersionRequest(), VersionResponse());
