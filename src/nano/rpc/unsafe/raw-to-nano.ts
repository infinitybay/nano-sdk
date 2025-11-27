import { RawToNanoRequest } from "../requests/raw-to-nano";
import { RawToNanoResponse } from "../responses/raw-to-nano";
import { postFunction } from "./post";

export const raw_to_nano = postFunction(RawToNanoRequest(), RawToNanoResponse());
