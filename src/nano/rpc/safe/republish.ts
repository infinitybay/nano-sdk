import { RepublishRequest } from "../requests/republish";
import { RepublishResponse } from "../responses/republish";
import { safePostFunction } from "./post";

export const republish = safePostFunction(RepublishRequest(), RepublishResponse());
