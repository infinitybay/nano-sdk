import { postFunction } from "../http/post";
import { RepublishRequest } from "../requests/republish";
import { RepublishResponse } from "../responses/republish";

export const republish = postFunction(RepublishRequest(), RepublishResponse());
