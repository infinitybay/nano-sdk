import { UptimeRequest } from "../requests/uptime";
import { UptimeResponse } from "../responses/uptime";
import { postFunction } from "./post";

export const uptime = postFunction(UptimeRequest(), UptimeResponse());
