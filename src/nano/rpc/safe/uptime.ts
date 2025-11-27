import { UptimeRequest } from "../requests/uptime";
import { UptimeResponse } from "../responses/uptime";
import { safePostFunction } from "./post";

export const uptime = safePostFunction(UptimeRequest(), UptimeResponse());
