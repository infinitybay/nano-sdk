import { RepublishRequest } from "../requests/republish";
import { RepublishResponse } from "../responses/republish";
import { postFunction } from "./post";

export const republish = postFunction(RepublishRequest(), RepublishResponse());
