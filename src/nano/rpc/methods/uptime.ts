import { postFunction } from "../http/post";
import { UptimeRequest } from "../requests/uptime";
import { UptimeResponse } from "../responses/uptime";

export const uptime = postFunction(UptimeRequest(), UptimeResponse());
