import { RawToNanoRequest } from "../requests/raw-to-nano";
import { RawToNanoResponse } from "../responses/raw-to-nano";
import { safePostFunction } from "./post";

export const raw_to_nano = safePostFunction(RawToNanoRequest(), RawToNanoResponse());
